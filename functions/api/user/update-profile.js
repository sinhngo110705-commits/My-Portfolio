import { verifyJWT } from '../utils.js';

export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Authorization, Content-Type",
            }
        });
    }

    if (request.method !== "POST") {
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

        const { username } = await request.json();

        if (!username || username.length < 3) {
            return new Response(JSON.stringify({ error: "Username must be at least 3 characters" }), { status: 400 });
        }

        // Update Database D1
        await env.teemous_db.prepare(
            "UPDATE users SET username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).bind(username, payload.id).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: "Profile updated successfully",
            username 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
