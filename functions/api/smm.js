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

    async function resolveFbLink(rawLink) {
      if (!rawLink) return rawLink;
      let link = rawLink.trim();

      if (/^\d+$/.test(link)) {
        return { id: link, formattedLink: `https://facebook.com/${link}` };
      }

      const numMatch = link.match(/facebook\.com\/(?:profile\.php\?id=)?(\d+)/i);
      if (numMatch && numMatch[1]) {
        return { id: numMatch[1], formattedLink: `https://facebook.com/${numMatch[1]}` };
      }

      if (link.includes("facebook.com") || link.includes("fb.com")) {
        try {
          const lookupRes = await fetch("https://id.traodoisub.com/api.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ link: link })
          });
          const lookupData = await lookupRes.json();
          if (lookupData && lookupData.id) {
            return { id: lookupData.id, name: lookupData.name, formattedLink: `https://facebook.com/${lookupData.id}` };
          }
        } catch(err) {}
      }

      return { id: null, formattedLink: link };
    }

    if (params.action === "get_numeric_uid") {
      const resolved = await resolveFbLink(params.link);
      return new Response(JSON.stringify(resolved.id ? { success: true, id: resolved.id, name: resolved.name, link: resolved.formattedLink } : { success: false, error: "Không tìm thấy UID" }), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const action = params.action || (url.pathname.includes("services") ? "services" : "balance");

    if (action === "add" && params.link) {
      const resolved = await resolveFbLink(params.link);
      if (resolved.formattedLink) {
        params.link = resolved.formattedLink;
      }
    }

    const postParams = {
      key: smmKey,
      action: action,
      ...params
    };

    const smmResp = await fetch(smmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      },
      body: new URLSearchParams(postParams)
    });

    const smmData = await smmResp.json();

    if (action === "services" && Array.isArray(smmData)) {
      const vndRate = 26000;
      const margin = 1.20;
      const processed = smmData
        .filter(s => {
          const name = (s.name || "").toLowerCase();
          const cat = (s.category || "").toLowerCase();
          if (cat.includes("vip") || name.includes("vip") || (parseInt(s.min) === 1 && parseInt(s.max) === 1)) {
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
            rate_display: `${retailPerUnit.toLocaleString("vi-VN")} đ`
          };
        });
      return new Response(JSON.stringify(processed), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    return new Response(JSON.stringify(smmData), {
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}
