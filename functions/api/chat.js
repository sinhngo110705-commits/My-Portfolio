export async function onRequest(context) {
    const { request, env } = context;

    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { provider, model, messages, temperature, max_tokens } = await request.json();

        // 1. Handle Local Mode (LM Studio / Ollama via ngrok or direct)
        // Note: For "local" mode, the frontend will still try to call the direct URL first, 
        // but this backend can serve as a fallback or a way to unify the interface.
        if (provider === 'local') {
            return new Response(JSON.stringify({ error: "Local mode should be handled directly by the frontend for ngrok/localhost access." }), { status: 400 });
        }

        let apiUrl = "";
        let headers = { "Content-Type": "application/json" };
        let body = {};

        // 2. Provider Routing
        switch (provider) {
            case 'openai':
                apiUrl = "https://api.openai.com/v1/chat/completions";
                headers["Authorization"] = `Bearer ${env.OPENAI_API_KEY}`;
                body = {
                    model: model || "gpt-3.5-turbo",
                    messages,
                    temperature: temperature || 0.7,
                    max_tokens: max_tokens || 1000
                };
                break;

            case 'anthropic':
                apiUrl = "https://api.anthropic.com/v1/messages";
                headers["x-api-key"] = env.ANTHROPIC_API_KEY;
                headers["anthropic-version"] = "2023-06-01";
                // Anthropic uses a different system prompt structure
                const systemMsg = messages.find(m => m.role === 'system')?.content;
                const userMsgs = messages.filter(m => m.role !== 'system');
                body = {
                    model: model || "claude-3-haiku-20240307",
                    system: systemMsg,
                    messages: userMsgs,
                    max_tokens: max_tokens || 1000,
                    temperature: temperature || 0.7
                };
                break;

            case 'gemini':
                const geminiKey = env.GEMINI_API_KEY || env.GEMINI_API;
                if (!geminiKey) {
                    const keys = Object.keys(env).join(', ');
                    return new Response(JSON.stringify({ 
                        error: `GEMINI_API_KEY is missing. Available keys: [${keys || "None"}]. Please add GEMINI_API_KEY to your Cloudflare Variables.` 
                    }), { status: 500 });
                }

                // Fallback loop for Gemini models
                const modelFallback = [
                    model,
                    "gemini-1.5-flash",
                    "gemini-1.5-flash-8b",
                    "gemini-2.0-flash",
                    "gemini-pro"
                ].filter(Boolean);

                let lastError = null;

                for (const geminiModel of modelFallback) {
                    try {
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

                        if (response.ok) {
                            const data = await response.json();
                            const resultText = data.candidates[0].content.parts[0].text;
                            return new Response(JSON.stringify({ content: resultText }), {
                                headers: { "Content-Type": "application/json" }
                            });
                        }

                        const errorText = await response.text();
                        lastError = { status: response.status, body: errorText, model: geminiModel };
                        
                    } catch (err) {
                        lastError = { error: err.message };
                    }
                }

                return new Response(JSON.stringify({ 
                    error: `All Gemini models failed. Last error (${lastError.model}): ${lastError.body || lastError.error}` 
                }), { status: lastError.status || 500 });

            default:
                return new Response(JSON.stringify({ error: "Unsupported provider" }), { status: 400 });
        }

        // 3. Call External API
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.text();
            return new Response(JSON.stringify({ error: `Provider error: ${errorData}` }), { status: response.status });
        }

        const data = await response.json();

        // 4. Standardize Response format for Frontend
        let resultText = "";
        if (provider === 'openai') {
            resultText = data.choices[0].message.content;
        } else if (provider === 'anthropic') {
            resultText = data.content[0].text;
        } else if (provider === 'gemini') {
            resultText = data.candidates[0].content.parts[0].text;
        }

        return new Response(JSON.stringify({ content: resultText }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
