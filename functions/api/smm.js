export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      }
    });
  }

  try {
    const url = new URL(request.url);
    const smmKey = env.SMM_API_KEY || "";
    const smmUrl = env.SMM_API_URL || "https://dichvumxh.vn/api/v2";

    let params = {};
    if (request.method === "POST") {
      params = await request.json().catch(() => ({}));
    } else {
      for (const [k, v] of url.searchParams.entries()) {
        params[k] = v;
      }
    }

    const action = params.action || (url.pathname.includes('services') ? 'services' : 'balance');
    const postBody = new URLSearchParams({
      key: smmKey,
      action: action,
      ...params
    });

    const resp = await fetch(smmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      },
      body: postBody
    });

    const smmData = await resp.json();

    if (action === 'services' && Array.isArray(smmData)) {
      const vndRate = 26000;
      const margin = 1.20; // 20% lợi nhuận
      const processed = smmData
        .filter(s => {
          const name = (s.name || '').toLowerCase();
          const cat = (s.category || '').toLowerCase();
          if (cat.includes('vip') || name.includes('vip') || (parseInt(s.min) === 1 && parseInt(s.max) === 1)) {
            return false;
          }
          return true;
        })
        .map(s => {
          const usdPer1k = parseFloat(s.rate) || 0;
          const rawCostPerUnit = (usdPer1k * vndRate) / 1000;
          const retailPerUnit = Math.max(0.5, Math.round(rawCostPerUnit * margin * 10) / 10);
          const retailPer1k = Math.round(retailPerUnit * 1000);
          return {
            ...s,
            raw_rate_usd: usdPer1k,
            cost_vnd_unit: Math.round(rawCostPerUnit * 10) / 10,
            rate_vnd_unit: retailPerUnit,
            rate_vnd_1k: retailPer1k,
            rate_display: `${retailPerUnit.toLocaleString('vi-VN')} đ`
          };
        });
      return new Response(JSON.stringify(processed), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response(JSON.stringify(smmData), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, success: false }), {
      status: 500,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
