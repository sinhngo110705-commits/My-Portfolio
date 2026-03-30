import { onRequest as registerHandler } from '../functions/api/auth/register.js';
import { onRequest as loginHandler } from '../functions/api/auth/login.js';
import { onRequest as profileHandler } from '../functions/api/user/profile.js';
import { onRequest as updateProfileHandler } from '../functions/api/user/update-profile.js';
import { onRequest as uploadAvatarHandler } from '../functions/api/user/upload-avatar.js';
import { onRequest as vAvatarHandler } from '../functions/api/user/v-avatar.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    // 2. Handle API routes
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { provider, model, messages, temperature, max_tokens } = await request.json();
        
        // 2. Provider Routing
        switch (provider) {
          case 'openai':
            return await handleOpenAI(messages, model, temperature, max_tokens, env);
          case 'anthropic':
            return await handleAnthropic(messages, model, temperature, max_tokens, env);
          case 'gemini':
            return await handleGemini(messages, model, temperature, max_tokens, env);
          default:
            return new Response(JSON.stringify({ error: "Unsupported provider" }), { status: 400 });
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    // 3. Handle Account/User API routes
    if (url.pathname.startsWith("/api/")) {
      const apiContext = { request, env, waitUntil: (p) => ctx.waitUntil(p) };
      
      if (url.pathname === "/api/auth/register") return await registerHandler(apiContext);
      if (url.pathname === "/api/auth/login") return await loginHandler(apiContext);
      if (url.pathname === "/api/user/profile") return await profileHandler(apiContext);
      if (url.pathname === "/api/user/update-profile") return await updateProfileHandler(apiContext);
      if (url.pathname === "/api/user/upload-avatar") return await uploadAvatarHandler(apiContext);
      if (url.pathname === "/api/user/v-avatar") return await vAvatarHandler(apiContext);
      if (url.pathname === "/api/payment/webhook") return await handleSePayWebhook(request, env);
    }

    // 2. Fallback to static assets
    return env.ASSETS.fetch(request);
  }
};

async function handleOpenAI(messages, model, temperature, max_tokens, env) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: model || "gpt-3.5-turbo",
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000
    })
  });
  return await standardResponse(response, 'openai');
}

async function handleAnthropic(messages, model, temperature, max_tokens, env) {
  const apiUrl = "https://api.anthropic.com/v1/messages";
  const systemMsg = messages.find(m => m.role === 'system')?.content;
  const userMsgs = messages.filter(m => m.role !== 'system');
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: model || "claude-3-haiku-20240307",
      system: systemMsg,
      messages: userMsgs,
      max_tokens: max_tokens || 1000,
      temperature: temperature || 0.7
    })
  });
  return await standardResponse(response, 'anthropic');
}

async function handleGemini(messages, model, temperature, max_tokens, env) {
  let geminiKey = env.GEMINI_API_KEY || env.GEMINI_API;
  if (!geminiKey) {
    const keys = Object.keys(env).join(', ');
    return new Response(JSON.stringify({ 
      error: `GEMINI_API_KEY is missing. Available keys: [${keys || "None"}]. Please add GEMINI_API_KEY to your Worker Variables.` 
    }), { status: 500 });
  }
  
  geminiKey = geminiKey.trim(); // Ensure no whitespace

  const modelFallback = [
    model,
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-1.5-pro"
  ].filter(Boolean);

  const apiVersions = ["v1beta", "v1"];
  let attemptsLog = [];

  for (const geminiModel of modelFallback) {
    for (const version of apiVersions) {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/${version}/models/${geminiModel}:generateContent?key=${geminiKey}`;
        
        const systemMsg = messages.find(m => m.role === 'system')?.content;
        const rawMsgs = messages.filter(m => m.role !== 'system');
        const contents = [];
        
        rawMsgs.forEach(m => {
          const role = m.role === 'assistant' ? 'model' : 'user';
          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts[0].text += "\n\n" + m.content;
          } else {
            contents.push({ role: role, parts: [{ text: m.content }] });
          }
        });

        if (contents.length > 0 && contents[0].role !== 'user') {
          contents.unshift({ role: 'user', parts: [{ text: "Continue the conversation." }] });
        }

        // Universal approach: Prepend system message to the first user message
        // This avoids "Unknown name systemInstruction" errors on older/v1 endpoints
        const geminiContents = [...contents];
        if (systemMsg && geminiContents.length > 0 && geminiContents[0].role === 'user') {
          geminiContents[0].parts[0].text = `SYSTEM INSTRUCTION: ${systemMsg}\n\nUSER MESSAGE: ${geminiContents[0].parts[0].text}`;
        }

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiContents,
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
          })
        });

        if (response.ok) {
          return await standardResponse(response, 'gemini');
        }

        const errorText = await response.text();
        const shortError = errorText.substring(0, 100).replace(/[\r\n]/g, ' ');
        attemptsLog.push(`${geminiModel}(${version}): ${response.status} [${shortError}]`);
        console.log(`Gemini ${geminiModel} (${version}) failed: ${response.status} - ${shortError}`);
        
      } catch (err) {
        attemptsLog.push(`${geminiModel}(${version}): ERR ${err.message}`);
      }
    }
  }

  return new Response(JSON.stringify({ 
    error: `All models failed. Attempts: ${attemptsLog.join(' | ')}. Please check your API key permissions at ai.google.dev.` 
  }), { status: 500 });
}

async function standardResponse(response, provider) {
  if (!response.ok) {
    const errorData = await response.text();
    return new Response(JSON.stringify({ error: `Provider error: ${errorData}` }), { status: response.status });
  }
  const data = await response.json();
  let resultText = "";
  if (provider === 'openai') resultText = data.choices[0].message.content;
  else if (provider === 'anthropic') resultText = data.content[0].text;
  else if (provider === 'gemini') resultText = data.candidates[0].content.parts[0].text;
  
  return new Response(JSON.stringify({ content: resultText }), {
    headers: { "Content-Type": "application/json" }
  });
}

async function handleSePayWebhook(request, env) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const authHeader = request.headers.get("Authorization");
  const expectedToken = env.SEPAY_TOKEN; // Cần set trên Cloudflare Dashboard
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, transferAmount, referenceCode, content } = body;

    // Tìm User ID từ mã chuyển khoản (VD: NAP 123)
    const match = (code || content || "").match(/NAP\s?(\d+)/i);
    if (!match) return new Response(JSON.stringify({ success: true, message: "No payment code detected" }));

    const userId = parseInt(match[1]);
    const amount = parseInt(transferAmount);

    if (isNaN(amount) || amount <= 0) return new Response("Invalid amount", { status: 400 });

    // Kiểm tra User tồn tại
    const user = await env.teemous_db.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!user) return new Response(JSON.stringify({ success: true, message: "User ID not found in database" }));

    // Cập nhật số dư và ghi lịch sử (Chạy tuần tự trong Worker đơn giản)
    await env.teemous_db.prepare("UPDATE users SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(amount, userId).run();
    
    await env.teemous_db.prepare(
      "INSERT INTO transactions (user_id, amount, type, status, payment_method, ref_id, description) VALUES (?, ?, 'topup', 'success', 'mbbank', ?, ?)"
    ).bind(userId, amount, referenceCode || `SP-${Date.now()}`, `SePay Auto: ${content}`).run();

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } });

  } catch (e) {
    return new Response(JSON.stringify({ error: "Webhook Error", details: e.message }), { status: 500 });
  }
}
