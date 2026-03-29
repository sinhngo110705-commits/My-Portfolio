import { verifyJWT } from '../utils.js';

export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        });
    }

    if (request.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const jwtSecret = env.JWT_SECRET || "fallback_default_secret_please_change_in_production";
        
        const payload = await verifyJWT(token, jwtSecret);
        if (!payload || !payload.id) {
             return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
        }

        if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
            return new Response(JSON.stringify({ error: "Token expired" }), { status: 401 });
        }

        // Fetch User details
        const userQuery = await env.teemous_db.prepare(
            "SELECT id, email, username, avatar_url, balance, role, created_at FROM users WHERE id = ?"
        ).bind(payload.id).first();

        if (!userQuery) {
             return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Fetch Recent Transactions
        const { results: transactions } = await env.teemous_db.prepare(
            "SELECT id, amount, type, status, payment_method, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10"
        ).bind(payload.id).all();

        // Fetch Orders
        const { results: orders } = await env.teemous_db.prepare(
            "SELECT o.id, p.name as product_name, p.type as product_type, o.price_at_purchase, o.status, o.created_at FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id = ? ORDER BY o.created_at DESC LIMIT 20"
        ).bind(payload.id).all();

        return new Response(JSON.stringify({ 
            user: userQuery,
            transactions,
            orders
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
