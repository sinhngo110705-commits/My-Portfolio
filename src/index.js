export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Handle API routes
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
  const geminiKey = env.GEMINI_API_KEY || env.GEMINI_API;
  if (!geminiKey) {
    const keys = Object.keys(env).join(', ');
    return new Response(JSON.stringify({ 
      error: `GEMINI_API_KEY is missing. Available keys: [${keys || "None"}]. Please add GEMINI_API_KEY to your Worker Variables.` 
    }), { status: 500 });
  }

  const geminiModel = model || "gemini-1.5-flash-latest"; // Use -latest suffix for better mapping
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
  
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

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: systemMsg ? { parts: [{ text: systemMsg }] } : undefined,
      contents,
      generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
    })
  });
  return await standardResponse(response, 'gemini');
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
