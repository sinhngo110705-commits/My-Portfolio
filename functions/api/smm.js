import { verifyJWT } from "./utils.js";

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
    const jwtSecret = env.JWT_SECRET || "fallback_default_secret_please_change_in_production";

    let params = {};
    if (request.method === "POST") {
      params = await request.json().catch(() => ({}));
    } else {
      for (const [k, v] of url.searchParams.entries()) {
        params[k] = v;
      }
    }

    // Helper: Auto-resolve Facebook links to standard numeric UID
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
          const ctrl = new AbortController();
          const tid = setTimeout(() => ctrl.abort(), 2500);
          const lookupRes = await fetch("https://id.traodoisub.com/api.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "User-Agent": "Mozilla/5.0"
            },
            body: new URLSearchParams({ link: link }),
            signal: ctrl.signal
          });
          clearTimeout(tid);
          const lookupData = await lookupRes.json();
          if (lookupData && lookupData.id) {
            return { id: lookupData.id, name: lookupData.name, formattedLink: `https://facebook.com/${lookupData.id}` };
          }
        } catch(err) {}
      }

      return { id: null, formattedLink: link };
    }

    // Action: get_numeric_uid (Frontend auto UID lookup)
    if (params.action === "get_numeric_uid") {
      const resolved = await resolveFbLink(params.link);
      return new Response(JSON.stringify(resolved.id ? { success: true, id: resolved.id, name: resolved.name, link: resolved.formattedLink } : { success: false, error: "Không tìm thấy UID" }), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const action = params.action || (url.pathname.includes("services") ? "services" : "balance");

    // Action: services (List available packages with 20% margin)
    if (action === "services") {
      if (!smmKey) {
        return new Response(JSON.stringify([]), {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }

      const smmResp = await fetch(smmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0" },
        body: new URLSearchParams({ key: smmKey, action: "services" })
      });

      const smmData = await smmResp.json();
      if (Array.isArray(smmData)) {
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
    }

    // Action: balance (Check agency balance)
    if (action === "balance") {
      const smmResp = await fetch(smmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key: smmKey, action: "balance" })
      });
      const smmData = await smmResp.json();
      return new Response(JSON.stringify(smmData), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // Action: status (Check & sync order status)
    if (action === "status") {
      const orderParam = params.order || "";
      if (!orderParam) {
        return new Response(JSON.stringify({ error: "Missing order ID" }), { status: 400 });
      }

      let dbOrder = null;
      if (env.teemous_db) {
        try {
          dbOrder = await env.teemous_db.prepare(
            "SELECT * FROM orders WHERE id = ? OR smm_order_id = ? LIMIT 1"
          ).bind(orderParam, orderParam).first();
        } catch(e) {}
      }

      // If order is currently in queue (Pending) without partner ID
      if (dbOrder && (!dbOrder.smm_order_id || dbOrder.smm_order_id === "") && dbOrder.status === "Pending") {
        return new Response(JSON.stringify({
          order: dbOrder.id,
          status: "Pending",
          start_count: 0,
          remains: dbOrder.quantity || 0,
          internal: true,
          message: "Đơn hàng đang trong hàng chờ duyệt của hệ thống (Admin sẽ sớm duyệt và kích hoạt đơn cho bạn)."
        }), {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }

      // Query upstream API with partner SMM order id or raw id
      const targetOrderId = (dbOrder && dbOrder.smm_order_id) ? dbOrder.smm_order_id : orderParam;
      const smmResp = await fetch(smmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key: smmKey, action: "status", order: targetOrderId })
      });
      const info = await smmResp.json();

      // Sync status to local DB if updated
      if (dbOrder && info && info.status && env.teemous_db) {
        let mappedStatus = info.status;
        if (info.status === "In progress" || info.status === "Processing") mappedStatus = "Running";
        if (info.status !== dbOrder.status) {
          try {
            await env.teemous_db.prepare(
              "UPDATE orders SET status = ? WHERE id = ?"
            ).bind(mappedStatus, dbOrder.id).run();
          } catch(e) {}
        }
      }

      return new Response(JSON.stringify(info), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // Action: add (Place order with real DB transaction & auto-queue support)
    if (action === "add") {
      // 1. Authenticate user from JWT token
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({
          error: "Vui lòng đăng nhập tài khoản Teemous để tạo đơn và thanh toán trực tiếp từ ví!",
          success: false
        }), { status: 401, headers: { "Content-Type": "application/json; charset=utf-8" } });
      }

      const token = authHeader.split(" ")[1];
      const payload = await verifyJWT(token, jwtSecret);
      if (!payload || !payload.id) {
        return new Response(JSON.stringify({ error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn!", success: false }), {
          status: 401, headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }

      // 2. Fetch User from D1 database
      let user = null;
      if (env.teemous_db) {
        user = await env.teemous_db.prepare(
          "SELECT id, username, email, balance FROM users WHERE id = ? LIMIT 1"
        ).bind(payload.id).first();
      }

      if (!user) {
        return new Response(JSON.stringify({ error: "Không tìm thấy người dùng trong cơ sở dữ liệu!", success: false }), {
          status: 404, headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }

      // 3. Resolve and validate link
      let link = (params.link || "").trim();
      const resolved = await resolveFbLink(link);
      if (resolved && resolved.formattedLink) {
        link = resolved.formattedLink;
      }

      const quantity = parseInt(params.quantity || 0);
      if (!quantity || quantity <= 0) {
        return new Response(JSON.stringify({ error: "Số lượng không hợp lệ!", success: false }), {
          status: 400, headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }

      const unitRate = parseFloat(params.rate || 1);
      const totalCost = Math.round(quantity * unitRate);
      const currentBalance = parseInt(user.balance || 0);

      // 4. Verify balance in DB
      if (currentBalance < totalCost) {
        const missing = totalCost - currentBalance;
        return new Response(JSON.stringify({
          error: `Số dư ví không đủ (Cần: ${totalCost.toLocaleString("vi-VN")} đ • Hiện có: ${currentBalance.toLocaleString("vi-VN")} đ • Thiếu: ${missing.toLocaleString("vi-VN")} đ). Vui lòng nạp thêm tiền vào ví!`,
          success: false,
          current_balance: currentBalance,
          total_cost: totalCost
        }), { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } });
      }

      const serviceId = params.service || "317835";
      const serviceName = params.service_name || "Dịch vụ tăng tương tác SMM";

      // 5. Setup DB schema & Product record (Auto-migration)
      let productId = 1;
      if (env.teemous_db) {
        try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN service_name TEXT").run(); } catch(e) {}
        try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN link TEXT").run(); } catch(e) {}
        try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN quantity INTEGER").run(); } catch(e) {}
        try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN smm_service_id TEXT").run(); } catch(e) {}
        try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN smm_order_id TEXT").run(); } catch(e) {}

        // Find or create matching product record
        let existingProd = await env.teemous_db.prepare(
          "SELECT id FROM products WHERE name = ? LIMIT 1"
        ).bind(serviceName).first();

        if (existingProd) {
          productId = existingProd.id;
        } else {
          const insertProd = await env.teemous_db.prepare(
            "INSERT INTO products (name, type, price, description) VALUES (?, 'service', ?, 'Dịch vụ tăng tương tác mạng xã hội SMM')"
          ).bind(serviceName, Math.round(unitRate * 1000)).run();
          productId = insertProd.meta?.last_row_id || 1;
        }
      }

      // 6. Attempt Dispatch to dichvumxh.vn
      let smmData = null;
      let upstreamSuccess = false;
      let isBalanceError = false;

      if (smmKey) {
        try {
          const postParams = {
            key: smmKey,
            action: "add",
            service: serviceId,
            link: link,
            quantity: quantity
          };

          const smmResp = await fetch(smmUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0" },
            body: new URLSearchParams(postParams)
          });

          smmData = await smmResp.json();
          if (smmData && smmData.order) {
            upstreamSuccess = true;
          } else {
            const errStr = (smmData?.error || "").toLowerCase();
            if (errStr.includes("số dư") || errStr.includes("balance") || errStr.includes("không đủ")) {
              isBalanceError = true;
            }
          }
        } catch (apiErr) {
          console.error("Upstream SMM dispatch error:", apiErr);
        }
      }

      // If upstream failed for reasons OTHER than balance/temporary (e.g. invalid format that couldnt be fixed)
      if (!upstreamSuccess && !isBalanceError && smmData && smmData.error && !smmData.error.toLowerCase().includes("số dư")) {
        return new Response(JSON.stringify({
          error: `Thông báo từ hệ thống: ${smmData.error}`,
          success: false
        }), { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } });
      }

      // 7. Atomic DB Balance Deduction, Transaction Logging & Order Creation
      const newBalance = currentBalance - totalCost;
      const partnerOrderId = upstreamSuccess ? String(smmData.order) : "";
      const orderStatus = upstreamSuccess ? "Running" : "Pending";
      const txDesc = upstreamSuccess
        ? `Thanh toán đơn SMM #${partnerOrderId}: ${serviceName} (SL: ${quantity.toLocaleString("vi-VN")})`
        : `Thanh toán đơn SMM (Hàng chờ duyệt): ${serviceName} (SL: ${quantity.toLocaleString("vi-VN")})`;
      const txRef = `SMM-${Date.now()}-${user.id}`;

      let createdOrderId = null;

      if (env.teemous_db) {
        // Run batch updates for data integrity
        const batchResults = await env.teemous_db.batch([
          // Deduct user balance
          env.teemous_db.prepare(
            "UPDATE users SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
          ).bind(totalCost, user.id),

          // Record in transactions
          env.teemous_db.prepare(
            "INSERT INTO transactions (user_id, amount, type, status, payment_method, description, ref_id) VALUES (?, ?, 'purchase', 'success', 'balance', ?, ?)"
          ).bind(user.id, totalCost, txDesc, txRef),

          // Record in orders
          env.teemous_db.prepare(
            "INSERT INTO orders (user_id, product_id, price_at_purchase, status, service_name, link, quantity, smm_service_id, smm_order_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(user.id, productId, totalCost, orderStatus, serviceName, link, quantity, serviceId, partnerOrderId)
        ]);

        createdOrderId = batchResults[2]?.meta?.last_row_id;
      }

      // If dispatched immediately
      if (upstreamSuccess) {
        return new Response(JSON.stringify({
          success: true,
          order: partnerOrderId,
          internal_order_id: createdOrderId,
          status: "Running",
          new_balance: newBalance,
          message: "Tạo đơn hàng và trừ ví thành công!"
        }), {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        });
      }

      // If queued due to agency balance or pending approval
      return new Response(JSON.stringify({
        success: true,
        queued: true,
        order: createdOrderId || partnerOrderId || Date.now(),
        internal_order_id: createdOrderId,
        status: "Pending",
        new_balance: newBalance,
        message: "Đơn hàng đã được tiếp nhận và đưa vào hàng chờ xử lý."
      }), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    return new Response(JSON.stringify({ error: "Action not recognized" }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, success: false }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}
