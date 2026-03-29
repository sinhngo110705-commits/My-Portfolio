import { hashPassword } from '../utils.js';

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
        const { email, password, username } = await request.json();

        if (!email || !password || !username) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: "Invalid email format" }), { status: 400 });
        }

        // Optional: Call Cloudflare Turnstile Verification API here if token is provided
        // const { turnstileToken } = await request.json(); 
        // ... verify turnstileToken ...

        // Check if email already exists
        const { results } = await env.teemous_db.prepare(
            "SELECT id FROM users WHERE email = ? LIMIT 1"
        ).bind(email).all();

        if (results.length > 0) {
            return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Insert into database
        const insertResult = await env.teemous_db.prepare(
            "INSERT INTO users (email, password_hash, username, avatar_url, balance, role) VALUES (?, ?, ?, ?, 0, 'user') RETURNING id"
        ).bind(email, hashedPassword, username, `https://api.dicebear.com/8.x/identicon/svg?seed=${username}`).all();

        if (insertResult.success) {
            return new Response(JSON.stringify({ message: "Registration successful" }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            throw new Error("Failed to insert user");
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: error.message }), { status: 500 });
    }
}
