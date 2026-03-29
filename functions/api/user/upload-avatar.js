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

        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return new Response(JSON.stringify({ error: "No valid file uploaded" }), { status: 400 });
        }

        // Limit file size to 2MB
        if (file.size > 2 * 1024 * 1024) {
            return new Response(JSON.stringify({ error: "File too large (Max 2MB)" }), { status: 400 });
        }

        // Generate a unique filename for R2
        const key = `avatars/${payload.id}-${Date.now()}.png`;

        // Upload to R2
        await env.BUCKET.put(key, file.stream(), {
            httpMetadata: { contentType: file.type || 'image/png' }
        });

        // The URL point to the internal avatar viewer API
        const avatarUrl = `/api/user/v-avatar?key=${key}`;

        // Update Database D1
        await env.teemous_db.prepare(
            "UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
        ).bind(avatarUrl, payload.id).run();

        return new Response(JSON.stringify({ 
            success: true, 
            message: "Avatar updated successfully",
            avatar_url: avatarUrl 
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
