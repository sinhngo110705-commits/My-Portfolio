export async function onRequest(context) {
    const { request, env } = context;

    if (request.method === "OPTIONS") {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        });
    }

    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json().catch(() => ({}));
        const messages = body.messages || [];
        const userMsg = (messages.length > 0 ? messages[messages.length - 1].content : "") || "";
        function removeAccents(str) {
            return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
        }

        // High-precision RAG Knowledge Base Generator
        function getRagReply(rawText) {
            const clean = removeAccents(rawText);

            // Math calculation check
            const mathMatch = (rawText || "").match(/^\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*\??\s*$/);
            if (mathMatch) {
                const a = parseFloat(mathMatch[1]);
                const op = mathMatch[2];
                const b = parseFloat(mathMatch[3]);
                let res = 0;
                if (op === '+') res = a + b;
                else if (op === '-') res = a - b;
                else if (op === '*') res = a * b;
                else if (op === '/' && b !== 0) res = a / b;
                return `Kết quả phép tính ${a} ${op} ${b} = ${res} nhé! Bạn cần mình giải đáp thêm thông tin gì nè?`;
            }

            // Greetings
            if (/^(chao|xin chao|hi|hello|helo|alo|hey|good morning|good evening)\b/i.test(clean) || clean === 'chao' || clean === 'hi') {
                return "Xin chào bạn! Mình là Teemous AI. Rất vui được gặp bạn! Hôm nay mình có thể hỗ trợ bạn tư vấn nhận suất làm Portfolio 0đ, khám phá Portfolio Hub hay dịch vụ tăng trưởng MXH SMM?";
            }

            // Who is AI
            if (/\b(ban la ai|who are you|tro ly|ten gi|gioi thieu ban than)\b/i.test(clean)) {
                return "Mình là Teemous AI, trợ lý số thông minh của Teemous Digital Lab do Ngô Quang Sinh sáng lập. Mình chuyên hỗ trợ tư vấn làm Portfolio cá nhân chuẩn quốc tế, tra cứu thông tin hồ sơ tài năng Portfolio Hub và cung cấp các dịch vụ tăng trưởng mạng xã hội uy tín!";
            }

            // Personnel: Thuy Duong (#01) & Algorithms
            if (/\b(thuy duong|tran thi thuy duong|icpc|dijkstra|thuat toan|shecodes)\b/i.test(clean)) {
                return "Trần Thị Thùy Dương (#01 - 96.0 điểm, Tier S+ Apex) là tài năng Khoa học Máy tính tại VKU (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế (9.3/10), đạt giải ICPC Quốc gia và Top 6 SheCodes. Dương chuyên sâu thuật toán, C++, Java, Full-Stack Web và Flutter Mobile!";
            }

            // Personnel: Thai Trung (#02) & Backend
            if (/\b(thai trung|le thai trung|backend|postman|intellij)\b/i.test(clean)) {
                return "Lê Thái Trung (#02 - 90.5 điểm, Tier S Professional) là kỹ sư Kỹ nghệ Phần mềm tại ĐH Duy Tân, chuyên về Backend Development, RESTful APIs, IntelliJ IDEA, Postman và Linux/Git.";
            }

            // Personnel: Quang Sinh (#03) & Founder
            if (/\b(quang sinh|ngo quang sinh|founder|admin)\b/i.test(clean)) {
                return "Ngô Quang Sinh (#03 - 88.0 điểm, Tier A+ Impressive) là Nhà sáng lập Teemous Digital Lab, sinh viên Digital Marketing tại ĐH Duy Tân. Sinh chuyên kiến trúc Web, tự động hóa AI Workflows, Google AppsScript và phát triển hệ sinh thái số. Bạn có thể liên hệ Sinh qua FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297 nhé!";
            }

            // Personnel: Bao Han (#04) & HR
            if (/\b(bao han|bui luu bao han|nhan su|hr|notion)\b/i.test(clean)) {
                return "Bùi Lưu Bảo Hân (#04 - 84.0 điểm, Tier A Standard) là sinh viên Kinh doanh Quốc tế tại ĐH Duy Tân, có thế mạnh về Quản trị Nhân sự (HR), vận hành cộng đồng thanh niên, quản trị dữ liệu với Notion & Google Sheets.";
            }

            // Personnel: Quang Tuan (#05) & Design
            if (/\b(quang tuan|vuong quang tuan|capcut|canva|fb ads)\b/i.test(clean)) {
                return "Vương Quang Tuấn (#05 - 80.5 điểm, Tier A Standard) là nhân sự Sáng tạo Nội dung năng động, chuyên thiết kế hình ảnh bằng Canva, dựng video ngắn CapCut, quản trị kênh Fanpage và chạy Facebook Ads cơ bản.";
            }

            // Pricing & 0đ Grant
            if (/\b(bang gia|chi phi|bao nhieu|bao gia|0d|mien phi|free|cost|price|goi khoi tao)\b/i.test(clean) || (/\bgia\b/i.test(clean) && !/\b(tham gia|danh gia|quoc gia|tac gia|chuyen gia|giai thuat|giai thich)\b/i.test(clean))) {
                return "Hiện tại gói Khởi Tạo Portfolio Cơ Bản đang được TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) cho người đăng ký sớm! Gói Khởi Tạo Nâng Cao (Bespoke VIP) hiện đang tạm khóa để remake phiên bản mới. Bạn hãy vào mục SERVICES & SHOP để nhận suất 0đ ngay nha!";
            }

            // Portfolio Hub & Showcases
            if (/\b(portfolio hub|hub|mau ho so|mau portfolio|xep hang|showcase|danh ba)\b/i.test(clean)) {
                return "Portfolio Hub xếp hạng hồ sơ công tâm dựa trên giá trị thực tế tạo ra cho cộng đồng & sản phẩm thực chiến: S+ Apex (>=95.0 - Thùy Dương), S Professional (90.0-94.9 - Thái Trung), A+ Impressive (85.0-89.9 - Quang Sinh), A Standard (80.0-84.9 - Bảo Hân, Quang Tuấn). Bạn bấm mục 'Portfolio Hub' trên menu để xem chi tiết nhé!";
            }

            // SMM / Social Growth
            if (/\b(smm|mang xa hoi|buff|follow|like|tang like|tang follow|view tiktok|sub fb|vietqr)\b/i.test(clean)) {
                return "Hệ thống SMM của Teemous Digital hỗ trợ tăng like, follow, view, tương tác bài viết cho Facebook, Instagram, Threads, TikTok với giá từ vài chục đồng/tương tác. Tự động lấy UID từ link, bảo mật 100% không cần mật khẩu và nạp tiền tự động qua VietQR!";
            }

            // Contact Admin
            if (/\b(lien he|contact|zalo|email|so dien thoai|sdt|inbox)\b/i.test(clean)) {
                return "Bạn có thể liên hệ trực tiếp với Quang Sinh qua Facebook: facebook.com/quang.sinh.5492, Zalo: 0797747297 hoặc email: teemous.contact@gmail.com nha!";
            }

            // Services Overview
            if (/\b(dich vu|services|lam duoc gi|ho tro gi|lam gi)\b/i.test(clean)) {
                return "Teemous Digital cung cấp các dịch vụ: Khởi tạo Portfolio cá nhân (đang có suất tài trợ 0đ), Dịch vụ tăng trưởng Mạng Xã Hội SMM (Facebook, TikTok, Instagram) và Tự động hóa công cụ AI. Bạn cần mình tư vấn mục nào nhất?";
            }

            // AOV Shop
            if (/\b(lien quan|aov|shop acc|mua acc|nick|skin)\b/i.test(clean)) {
                return "Cửa hàng Liên Quân hiện đang tạm ngưng hoạt động để bảo trì hệ thống máy chủ và nâng cấp quy trình giao dịch bảo mật. Bạn vui lòng quay lại sau nhé!";
            }

            // Intelligent Default
            return "Chào bạn! Mình là Teemous AI, trợ lý số của Teemous Digital Lab (Founder: Ngô Quang Sinh). Mình có thể hỗ trợ bạn:\n• Đăng ký nhận suất tài trợ 100% Khởi tạo Portfolio cá nhân 0đ (giá gốc 49k)\n• Tra cứu hồ sơ tài năng thực chiến tại Portfolio Hub\n• Tư vấn dịch vụ tăng trưởng mạng xã hội SMM (Facebook, TikTok, Instagram)\n• Kết nối trực tiếp với Founder Quang Sinh (FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297).\nBạn cần mình tư vấn chi tiết phần nào nè?";
        }

        let reply = null;

        // 1. Try Cloudflare Workers AI if bound
        if (env && env.AI) {
            try {
                const systemPrompt = "Bạn là Teemous AI, trợ lý số của Teemous Digital Lab (Founder: Ngô Quang Sinh). Trả lời ngắn gọn, thân thiện, chính xác bằng Tiếng Việt.";
                const aiRes = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages.slice(-5)
                    ]
                });
                if (aiRes && aiRes.response && aiRes.response.trim()) {
                    reply = aiRes.response.trim();
                }
            } catch (aiErr) {}
        }

        // 2. Try Gemini with multi-model fallback
        const geminiKey = env && (env.GEMINI_API_KEY || env.GEMINI_API);
        if (!reply && geminiKey) {
            const geminiModels = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-pro"];
            for (const m of geminiModels) {
                try {
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey.trim()}`;
                    const systemMsg = "Bạn là Teemous AI, trợ lý ảo của Teemous Digital Lab (Founder: Ngô Quang Sinh). Trả lời thân thiện, hữu ích, chuyên nghiệp bằng Tiếng Việt.";
                    const contents = [
                        { role: "user", parts: [{ text: `${systemMsg}\n\nNgười dùng hỏi: ${userMsg}` }] }
                    ];
                    const gRes = await fetch(geminiUrl, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 800, temperature: 0.7 } })
                    });
                    if (gRes.ok) {
                        const gData = await gRes.json();
                        const gText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (gText && gText.trim()) {
                            reply = gText.trim();
                            break;
                        }
                    }
                } catch (gErr) {}
            }
        }

        // 3. High-precision RAG matcher
        if (!reply) {
            reply = getRagReply(userMsg);
        }

        return new Response(JSON.stringify({ content: reply, role: "assistant" }), {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch(err) {
        return new Response(JSON.stringify({ content: "Chào bạn! Mình là Teemous AI. Mình có thể hỗ trợ bạn về dịch vụ làm Portfolio, buff tương tác mạng xã hội Meta hoặc kết nối trực tiếp với Quang Sinh qua Facebook: facebook.com/quang.sinh.5492 nhé!", role: "assistant" }), {
            headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" }
        });
    }
}
