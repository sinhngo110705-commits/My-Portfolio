import { verifyJWT } from '../utils.js';

/**
 * Admin Management API
 * 
 * SECURITY MODEL (Double-Layer):
 * 1. Verify JWT is valid (not tampered)
 * 2. Re-query DB to confirm role = 'admin' (prevents localStorage spoofing)
 * 
 * GET  ?action=users          → list all users
 * POST { action:'update_balance', userId, amount }  → set balance
 * POST { action:'update_role',    userId, role }    → set role
 * POST { action:'grant_order',    userId, productId } → grant product
 */

async function verifyAdmin(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const jwtSecret = env.JWT_SECRET || 'fallback_default_secret_please_change_in_production';
    const payload = await verifyJWT(token, jwtSecret);
    if (!payload || !payload.id) return null;

    // ⚠️ CRITICAL: Re-check role FROM DB — never trust client data
    const userFromDb = await env.teemous_db
        .prepare('SELECT id, role FROM users WHERE id = ? LIMIT 1')
        .bind(payload.id)
        .first();

    if (!userFromDb || userFromDb.role !== 'admin') return null;
    return userFromDb;
}

export async function onRequest(context) {
    const { request, env } = context;

    // CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    // ── Verify admin identity ──────────────────────────────────────────────
    const admin = await verifyAdmin(request, env);
    if (!admin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // ── GET: Fetch user list ───────────────────────────────────────────
        if (request.method === 'GET') {
            const url = new URL(request.url);
            const action = url.searchParams.get('action');

            if (action === 'users') {
                const { results } = await env.teemous_db.prepare(
                    'SELECT id, username, email, balance, role, created_at FROM users ORDER BY id DESC'
                ).all();
                return new Response(JSON.stringify({ users: results }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            if (action === 'products') {
                const { results } = await env.teemous_db.prepare(
                    'SELECT id, name, type, price, stock FROM products ORDER BY id DESC'
                ).all();
                return new Response(JSON.stringify({ products: results }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
        }

        // ── POST: Modify data ──────────────────────────────────────────────
        if (request.method === 'POST') {
            const body = await request.json();
            const { action } = body;

            // Update user balance
            if (action === 'update_balance') {
                const { userId, amount } = body;
                if (!userId || amount === undefined || amount === null) {
                    return new Response(JSON.stringify({ error: 'Missing userId or amount' }), { status: 400 });
                }
                const parsed = parseInt(amount);
                if (isNaN(parsed) || parsed < 0) {
                    return new Response(JSON.stringify({ error: 'Invalid amount value' }), { status: 400 });
                }
                await env.teemous_db.prepare(
                    'UPDATE users SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
                ).bind(parsed, userId).run();
                return new Response(JSON.stringify({ success: true, message: `Balance updated to ${parsed} VND` }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Update user role
            if (action === 'update_role') {
                const { userId, role } = body;
                const validRoles = ['user', 'admin'];
                if (!userId || !role || !validRoles.includes(role)) {
                    return new Response(JSON.stringify({ error: 'Invalid userId or role' }), { status: 400 });
                }
                await env.teemous_db.prepare(
                    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
                ).bind(role, userId).run();
                return new Response(JSON.stringify({ success: true, message: `Role updated to ${role}` }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Grant product to user (create order)
            if (action === 'grant_order') {
                const { userId, productId } = body;
                if (!userId || !productId) {
                    return new Response(JSON.stringify({ error: 'Missing userId or productId' }), { status: 400 });
                }
                // Look up product price
                const product = await env.teemous_db.prepare(
                    'SELECT id, price FROM products WHERE id = ? LIMIT 1'
                ).bind(productId).first();
                if (!product) {
                    return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
                }
                await env.teemous_db.prepare(
                    "INSERT INTO orders (user_id, product_id, price_at_purchase, status) VALUES (?, ?, ?, 'completed')"
                ).bind(userId, productId, 0).run();
                return new Response(JSON.stringify({ success: true, message: 'Order granted' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
