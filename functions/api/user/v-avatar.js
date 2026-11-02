export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const key = url.searchParams.get("key");

    if (!key || !key.startsWith("avatars/") || key.includes("..")) {
        return new Response(JSON.stringify({ error: "Invalid key or forbidden path" }), { 
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Read from Cloudflare R2
        const object = await env.BUCKET.get(key);

        if (object === null) {
            return new Response("Object Not Found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        
        // Add security and cache control headers
        headers.set("Cache-Control", "public, max-age=86400"); // 1 day
        headers.set("X-Content-Type-Options", "nosniff");
        headers.set("Content-Security-Policy", "default-src 'none'");

        return new Response(object.body, {
            headers,
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: "Internal Server Error", details: e.message }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
