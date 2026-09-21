import { verifyJWT } from "../utils.js";

async function verifyAdmin(request, env) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const jwtSecret = env.JWT_SECRET || "fallback_default_secret_please_change_in_production";
    const payload = await verifyJWT(token, jwtSecret);
    if (!payload || !payload.id) return null;

    if (!env.teemous_db) return null;

    const userFromDb = await env.teemous_db
        .prepare("SELECT id, role FROM users WHERE id = ? LIMIT 1")
        .bind(payload.id)
        .first();

    if (!userFromDb || userFromDb.role !== "admin") return null;
    return userFromDb;
}

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

    const admin = await verifyAdmin(request, env);
    if (!admin) {
        return new Response(JSON.stringify({ error: "Forbidden: Admin access required" }), {
            status: 403,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        if (request.method === "GET") {
            const url = new URL(request.url);
            const action = url.searchParams.get("action");

            if (action === "users") {
                const { results } = await env.teemous_db.prepare(
                    "SELECT id, username, email, balance, role, created_at FROM users ORDER BY id DESC"
                ).all();
                return new Response(JSON.stringify({ users: results }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }

            if (action === "smm_orders" || action === "orders") {
                try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN service_name TEXT").run(); } catch(e) {}
                try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN link TEXT").run(); } catch(e) {}
                try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN quantity INTEGER").run(); } catch(e) {}
                try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN smm_service_id TEXT").run(); } catch(e) {}
                try { await env.teemous_db.prepare("ALTER TABLE orders ADD COLUMN smm_order_id TEXT").run(); } catch(e) {}

                const query = "SELECT o.id, o.user_id, u.username, u.email, " +
                              "COALESCE(o.service_name, p.name, 'Đơn SMM #' || o.id) as service_name, " +
                              "o.link, o.quantity, o.price_at_purchase, " +
                              "o.smm_service_id, o.smm_order_id, " +
                              "o.status, o.created_at " +
                              "FROM orders o " +
                              "LEFT JOIN users u ON o.user_id = u.id " +
                              "LEFT JOIN products p ON o.product_id = p.id " +
                              "ORDER BY o.id DESC LIMIT 200";

                const { results } = await env.teemous_db.prepare(query).all();
                const pendingCount = (results || []).filter(o => o.status === "Pending" || !o.smm_order_id).length;

                return new Response(JSON.stringify({ orders: results, pending_count: pendingCount }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }

            if (action === "products") {
                const { results } = await env.teemous_db.prepare(
                    "SELECT id, name, type, price, stock FROM products ORDER BY id DESC"
                ).all();
                return new Response(JSON.stringify({ products: results }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }

            return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        }

        if (request.method === "POST") {
            const body = await request.json().catch(() => ({}));
            const { action } = body;

            if (action === "dispatch_smm_order") {
                const orderId = body.orderId;
                if (!orderId) {
                    return new Response(JSON.stringify({ error: "Missing orderId" }), { status: 400 });
                }

                const order = await env.teemous_db.prepare(
                    "SELECT * FROM orders WHERE id = ? LIMIT 1"
                ).bind(orderId).first();

                if (!order) {
                    return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
                }

                const smmKey = env.SMM_API_KEY || "";
                const smmUrl = env.SMM_API_URL || "https://dichvumxh.vn/api/v2";

                if (!smmKey) {
                    return new Response(JSON.stringify({ error: "Chưa cấu hình SMM_API_KEY trên Cloudflare!" }), { status: 400 });
                }

                const postParams = {
                    key: smmKey,
                    action: "add",
                    service: order.smm_service_id || "317835",
                    link: order.link,
                    quantity: order.quantity || 100
                };

                const smmResp = await fetch(smmUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "Mozilla/5.0" },
                    body: new URLSearchParams(postParams)
                });

                const smmData = await smmResp.json();

                if (smmData && smmData.order) {
                    await env.teemous_db.prepare(
                        "UPDATE orders SET status = 'Running', smm_order_id = ? WHERE id = ?"
                    ).bind(String(smmData.order), orderId).run();

                    return new Response(JSON.stringify({
                        success: true,
                        smm_order_id: smmData.order,
                        message: "Đã đẩy đơn #" + orderId + " lên máy chủ đối tác thành công! Mã đơn: #" + smmData.order
                    }), { status: 200, headers: { "Content-Type": "application/json" } });
                } else {
                    return new Response(JSON.stringify({
                        success: false,
                        error: smmData.error || "Máy chủ đối tác từ chối",
                        message: "Không thể đẩy đơn: " + (smmData.error || "Máy chủ từ chối")
                    }), { status: 400, headers: { "Content-Type": "application/json" } });
                }
            }

            if (action === "sync_order_status") {
                const orderId = body.orderId;
                const order = await env.teemous_db.prepare(
                    "SELECT * FROM orders WHERE id = ? LIMIT 1"
                ).bind(orderId).first();

                if (!order) {
                    return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
                }

                if (!order.smm_order_id) {
                    return new Response(JSON.stringify({ success: true, status: order.status, message: "Đơn hàng đang trong hàng chờ duyệt." }), {
                        headers: { "Content-Type": "application/json" }
                    });
                }

                const smmKey = env.SMM_API_KEY || "";
                const smmUrl = env.SMM_API_URL || "https://dichvumxh.vn/api/v2";

                const smmResp = await fetch(smmUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ key: smmKey, action: "status", order: order.smm_order_id })
                });
                const info = await smmResp.json();

                if (info && info.status) {
                    let mapped = info.status;
                    if (info.status === "In progress" || info.status === "Processing") mapped = "Running";
                    await env.teemous_db.prepare(
                        "UPDATE orders SET status = ? WHERE id = ?"
                    ).bind(mapped, orderId).run();

                    return new Response(JSON.stringify({
                        success: true,
                        status: mapped,
                        raw: info,
                        message: "Trạng thái đơn #" + orderId + ": " + mapped
                    }), { headers: { "Content-Type": "application/json" } });
                }

                return new Response(JSON.stringify({ success: false, info }), { headers: { "Content-Type": "application/json" } });
            }

            if (action === "update_balance") {
                const { userId, amount } = body;
                if (!userId || amount === undefined || amount === null) {
                    return new Response(JSON.stringify({ error: "Missing userId or amount" }), { status: 400 });
                }
                const parsed = parseInt(amount);
                if (isNaN(parsed) || parsed < 0) {
                    return new Response(JSON.stringify({ error: "Invalid amount value" }), { status: 400 });
                }
                await env.teemous_db.prepare(
                    "UPDATE users SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
                ).bind(parsed, userId).run();
                return new Response(JSON.stringify({ success: true, message: "Balance updated to " + parsed + " VND" }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }

            if (action === "update_role") {
                const { userId, role } = body;
                const validRoles = ["user", "admin"];
                if (!userId || !role || !validRoles.includes(role)) {
                    return new Response(JSON.stringify({ error: "Invalid userId or role" }), { status: 400 });
                }
                await env.teemous_db.prepare(
                    "UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
                ).bind(role, userId).run();
                return new Response(JSON.stringify({ success: true, message: "Role updated to " + role }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }

            return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400 });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
