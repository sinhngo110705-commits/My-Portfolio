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
                // Google Gemini integration
                const geminiKey = env.GEMINI_API_KEY || env.GEMINI_API;
                if (!geminiKey) {
                    const keys = Object.keys(env).join(', ');
                    return new Response(JSON.stringify({ 
                        error: `GEMINI_API_KEY is missing. Available keys: [${keys || "None"}]. Please add GEMINI_API_KEY to your Cloudflare Variables.` 
                    }), { status: 500 });
                }

                const geminiModel = model || "gemini-1.5-flash-latest"; // Use 1.5 flash for better free-tier availability
                apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`;
                
                // Extract system message
                const systemMsg_gemini = messages.find(m => m.role === 'system')?.content;
                
                // Group and alternate messages (Gemini requires: user, model, user, model...)
                const rawMsgs = messages.filter(m => m.role !== 'system');
                const contents = [];
                
                rawMsgs.forEach(m => {
                    const role = m.role === 'assistant' ? 'model' : 'user';
                    if (contents.length > 0 && contents[contents.length - 1].role === role) {
                        // Merge consecutive same-role messages
                        contents[contents.length - 1].parts[0].text += "\n\n" + m.content;
                    } else {
                        contents.push({
                            role: role,
                            parts: [{ text: m.content }]
                        });
                    }
                });

                // Gemini must START with 'user'
                if (contents.length > 0 && contents[0].role !== 'user') {
                    contents.unshift({ role: 'user', parts: [{ text: "Continue the conversation." }] });
                }

                body = {
                    systemInstruction: systemMsg_gemini ? { parts: [{ text: systemMsg_gemini }] } : undefined,
                    contents,
                    generationConfig: { 
                        maxOutputTokens: 1000, 
                        temperature: 0.7,
                        topP: 0.95,
                        topK: 40
                    }
                };
                break;

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
