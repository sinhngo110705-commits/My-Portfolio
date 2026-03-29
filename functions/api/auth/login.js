import { verifyPassword, signJWT } from '../utils.js';

export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        });
    }

    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Get user from DB
        const { results } = await env.teemous_db.prepare(
            "SELECT id, username, password_hash, role, balance, avatar_url FROM users WHERE email = ? LIMIT 1"
        ).bind(email).all();

        if (results.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        const user = results[0];

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
        }

        // Update last login (fire and forget)
        context.waitUntil(
            env.teemous_db.prepare("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(user.id).run()
        );

        // Sign JWT
        // Get JWT secret from env variables or use a default one for local testing
        const jwtSecret = env.JWT_SECRET || "fallback_default_secret_please_change_in_production";
        
        // Token expires in 7 days
        const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
        const token = await signJWT({ 
            id: user.id, 
            email: email,
            username: user.username,
            role: user.role,
            exp 
        }, jwtSecret);

        return new Response(JSON.stringify({ 
            message: "Login successful", 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: email,
                avatar_url: user.avatar_url,
                balance: user.balance,
                role: user.role
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
