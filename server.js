const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'Sinh Portfolio web');

let envConfig = {};
try {
  const envPath = path.join(__dirname, ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const l of lines) {
      const match = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || "").trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        envConfig[match[1]] = val;
      }
    }
  }
} catch (e) {}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function removeAccents(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
}

const TEEMOUS_SYSTEM_PROMPT = `Bạn là Teemous AI, trợ lý số thông minh độc quyền của Teemous Digital Lab (được sáng lập bởi Ngô Quang Sinh - sinh viên Digital Marketing tại ĐH Duy Tân).
Phong cách trả lời: Thân thiện, chu đáo, thông minh, chuyên nghiệp và có tính thẩm mỹ cao. Trình bày rõ ràng bằng Markdown (bullet points, **bold** từ khóa quan trọng).
Thông tin nền tảng về Teemous Digital Lab:
- Nhà sáng lập: Ngô Quang Sinh (#03 - Tier A+ Impressive, 88.0 điểm), chuyên gia Web Architecture, tự động hóa AI Workflows, Google AppsScript và hệ sinh thái số. Liên hệ Sinh: FB: facebook.com/quang.sinh.5492, Zalo: 0797747297, Email: teemous.contact@gmail.com.
- Portfolio Hub: Bảng xếp hạng hồ sơ năng lực thực chiến công tâm:
  + #01 Trần Thị Thùy Dương: Tier S+ Apex (96.0 điểm), VKU Khoa học Máy tính (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế, giải Quốc Gia ICPC, Top 6 SheCodes. Chuyên sâu thuật toán, C++, Java, Full-Stack Web và Flutter Mobile.
  + #02 Lê Thái Trung: Tier S Professional (90.5 điểm), ĐH Duy Tân Kỹ nghệ Phần mềm, chuyên Backend APIs, IntelliJ IDEA, Postman, Linux/Git.
  + #04 Bùi Lưu Bảo Hân: Tier A Standard (84.0 điểm), ĐH Duy Tân Kinh doanh Quốc tế, HR & Vận hành dữ liệu Notion/Sheets.
  + #05 Vương Quang Tuấn: Tier A Standard (80.5 điểm), Content Creator, Canva, CapCut, Facebook Ads.
- Dịch vụ & Sản phẩm chính:
  1. Khởi tạo Portfolio cá nhân: Đang có chương trình TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) gói Basic cho bạn trẻ đăng ký sớm! Gói VIP Bespoke đang tạm khóa để nâng cấp phiên bản mới.
  2. SMM Terminal (Dịch vụ Mạng Xã Hội): Tăng Like, Follow, View, Comment tương tác cho Facebook, Instagram, TikTok, Threads với giá cực tốt từ vài chục đồng, bảo mật 100% không cần mật khẩu, tự động lấy UID, nạp tiền tự động qua VietQR.
  3. Shop Liên Quân: Hiện đang tạm ngưng bảo trì hệ thống.
Hãy trả lời trực tiếp câu hỏi của người dùng bằng Tiếng Việt hoặc ngôn ngữ của người dùng.`;

async function callAiBackend(messages) {
  const cleanedMessages = (messages || []).filter(m => m && m.content).slice(-8);
  const payloadMessages = [
    { role: "system", content: TEEMOUS_SYSTEM_PROMPT },
    ...cleanedMessages
  ];
  const lastUserMsg = (cleanedMessages.length > 0 ? cleanedMessages[cleanedMessages.length - 1].content : "") || "";

  // 1. Try OpenAI
  const openaiKey = process.env.OPENAI_API_KEY || envConfig.OPENAI_API_KEY || "";
  if (openaiKey) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 18000);
      const oRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey.trim()}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: payloadMessages,
          temperature: 0.7,
          max_tokens: 600
        }),
        signal: ctrl.signal
      });
      clearTimeout(tid);
      if (oRes.ok) {
        const oData = await oRes.json();
        const oText = oData.choices?.[0]?.message?.content;
        if (oText && oText.trim()) return oText.trim();
      }
    } catch (e) {}
  }

  // 2. Try Gemini
  const geminiKey = process.env.GEMINI_API_KEY || envConfig.GEMINI_API_KEY || "";
  if (geminiKey) {
    const geminiModels = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-2.5-pro", "gemini-flash-latest"];
    for (const m of geminiModels) {
      try {
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 18000);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${geminiKey.trim()}`;
        const gRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: `${TEEMOUS_SYSTEM_PROMPT}\n\nNgười dùng hỏi: ${lastUserMsg}` }] }],
            generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
          }),
          signal: ctrl.signal
        });
        clearTimeout(tid);
        if (gRes.ok) {
          const gData = await gRes.json();
          const gText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (gText && gText.trim()) return gText.trim();
        }
      } catch (e) {}
    }
  }

  // 3. Try Local 9Router
  const routerKey = process.env.ROUTER_API_KEY || envConfig.ROUTER_API_KEY || "";
  const routerUrl = process.env.ROUTER_API_URL || envConfig.ROUTER_API_URL || "http://127.0.0.1:20128/v1/chat/completions";
  const candidateUrls = [routerUrl, "http://127.0.0.1:20128/v1/chat/completions", "http://127.0.0.1:1234/v1/chat/completions"];
  const uniqueUrls = [...new Set(candidateUrls)];

  for (const targetUrl of uniqueUrls) {
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 18000);
      const resp = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(routerKey ? { 'Authorization': 'Bearer ' + routerKey } : {})
        },
        body: JSON.stringify({
          model: 'custom-agents-for-chatbot',
          stream: false,
          messages: payloadMessages,
          temperature: 0.7,
          max_tokens: 800
        }),
        signal: ctrl.signal
      });
      clearTimeout(tid);
      if (resp.ok) {
        const data = await resp.json();
        const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text;
        if (content && content.trim()) return content.trim();
      }
    } catch (e) {}
  }
  return null;
}

function generateAIResponse(userText) {
  const raw = userText || "";
  const clean = removeAccents(raw);

  // Math calculation check
  const mathMatch = raw.match(/^\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\s*\??\s*$/);
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

function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);

  // Handle /api/config
  if (reqPath === "/api/config") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      router_key: process.env.ROUTER_API_KEY || envConfig.ROUTER_API_KEY || ""
    }));
    return;
  }

  // Handle /v1/models and /api/v1/models
  if (reqPath === '/v1/models' || reqPath === '/api/v1/models') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      data: [{ id: "custom-agents-for-chatbot" }, { id: "qwen/qwen3-vl-8b" }, { id: "teemous-assistant-v1" }]
    }));
    return;
  }

  // Handle /v1/chat/completions (OpenAI / LM Studio format)
  if (reqPath === '/v1/chat/completions' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const incomingMessages = Array.isArray(body.messages) ? body.messages : [];
        const userMsg = (incomingMessages.length > 0)
          ? incomingMessages[incomingMessages.length - 1].content
          : '';
        let reply = await callAiBackend(incomingMessages);
        if (!reply) {
          reply = generateAIResponse(userMsg);
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          id: "chatcmpl-" + Date.now(),
          choices: [
            {
              message: {
                role: "assistant",
                content: reply
              }
            }
          ]
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Handle /api/chat (Cloudflare Worker format)
  if (reqPath === '/api/chat' && req.method === 'POST') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const incomingMessages = Array.isArray(body.messages) ? body.messages : [];
        const userMsg = (incomingMessages.length > 0)
          ? incomingMessages[incomingMessages.length - 1].content
          : '';
        let reply = await callAiBackend(incomingMessages);
        if (!reply) {
          reply = generateAIResponse(userMsg);
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ content: reply, role: "assistant" }));
      } catch (e) {
        const fallback = generateAIResponse("");
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ content: fallback, role: "assistant" }));
      }
    });
    return;
  }

  // Handle /api/admin/manage (Local dev fallback)
  if (reqPath.startsWith('/api/admin/manage')) {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      if (req.method === 'GET') {
        res.end(JSON.stringify({
          users: [
            { id: 1, username: 'quangsinh', email: 'sinh@teemousdigital.id.vn', balance: 500000, role: 'admin', created_at: '2026-03-21 11:30:00' },
            { id: 2, username: 'demo_user', email: 'demo@gmail.com', balance: 50000, role: 'user', created_at: '2026-03-22 14:15:00' }
          ]
        }));
      } else {
        res.end(JSON.stringify({ success: true, message: 'Updated successfully (local mode)' }));
      }
    });
    return;
  }

    // Handle /api/smm (Social SMM Proxy to dichvumxh.vn)
  if (reqPath.startsWith('/api/smm')) {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', async () => {
      try {
        const smmKey = process.env.SMM_API_KEY || envConfig.SMM_API_KEY || "";
        const smmUrl = process.env.SMM_API_URL || envConfig.SMM_API_URL || "https://dichvumxh.vn/api/v2";

        let params = {};
        if (req.method === 'POST') {
          try { params = JSON.parse(bodyStr || '{}'); } catch(e) {}
        } else {
          const queryString = req.url.split('?')[1] || '';
          const searchParams = new URLSearchParams(queryString);
          for (const [k, v] of searchParams.entries()) {
            params[k] = v;
          }
        }

        // Helper: Resolve Facebook link or UID to standard https://facebook.com/<numeric_id>
        async function resolveFbLink(rawLink) {
          if (!rawLink) return rawLink;
          let link = rawLink.trim();

          // If raw numeric UID, format as standard profile link
          if (/^\d+$/.test(link)) {
            return { id: link, formattedLink: `https://facebook.com/${link}` };
          }

          // Never mutilate post/video/reel/photo links into profile links!
          const isPost = /\/(posts|photos|videos|reel|watch)\/|story_fbid|permalink\.php/i.test(link);
          if (isPost) {
            return { id: null, formattedLink: link };
          }

          // If already https://facebook.com/1000... or numeric profile link
          const numMatch = link.match(/facebook\.com\/(?:profile\.php\?id=)?(\d+)/i);
          if (numMatch && numMatch[1]) {
            return { id: numMatch[1], formattedLink: `https://facebook.com/${numMatch[1]}` };
          }

          // If Facebook link with username, lookup numeric UID via traodoisub
          if (link.includes("facebook.com") || link.includes("fb.com")) {
            try {
              const lookupRes = await fetch("https://id.traodoisub.com/api.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ link: link })
              });
              const lookupData = await lookupRes.json();
              if (lookupData && lookupData.id) {
                return { id: lookupData.id, name: lookupData.name, formattedLink: `https://facebook.com/${lookupData.id}` };
              }
            } catch(err) {
              console.log("UID lookup fallback error:", err.message);
            }
          }

          return { id: null, formattedLink: link };
        }

        // Action: get_numeric_uid (Frontend UID lookup button)
        if (params.action === 'get_numeric_uid') {
          const resolved = await resolveFbLink(params.link);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(resolved.id ? { success: true, id: resolved.id, name: resolved.name, link: resolved.formattedLink } : { success: false, error: "Không tìm thấy UID" }));
          return;
        }

        const action = params.action || (reqPath.includes('services') ? 'services' : 'balance');

        // If action is add, auto-resolve and format link
        if (action === 'add' && params.link) {
          const resolved = await resolveFbLink(params.link);
          if (resolved.formattedLink) {
            params.link = resolved.formattedLink;
          }
        }

        const postParams = {
          key: smmKey,
          action: action,
          ...params
        };

        const smmResp = await fetch(smmUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0'
          },
          body: new URLSearchParams(postParams)
        });

        const smmData = await smmResp.json();
        
        // If action is services, enhance with accurate VND retail rates
        if (action === 'services' && Array.isArray(smmData)) {
          const vndRate = 26000;
          const margin = 1.20; // 20% profit margin for the shop
          const processed = smmData
            .filter(s => {
              const name = (s.name || '').toLowerCase();
              const cat = (s.category || '').toLowerCase();
              if (cat.includes('vip') || name.includes('vip') || (parseInt(s.min) === 1 && parseInt(s.max) === 1)) {
                return false;
              }
              return true;
            })
            .map(s => {
              const usdPer1k = parseFloat(s.rate) || 0;
              const rawCostPerUnit = (usdPer1k * vndRate) / 1000;
              const retailPerUnit = Math.max(0.5, Math.round(rawCostPerUnit * margin * 10) / 10);
              const retailPer1k = Math.round(retailPerUnit * 1000);
              return {
                ...s,
                raw_rate_usd: usdPer1k,
                cost_vnd_unit: Math.round(rawCostPerUnit * 10) / 10,
                rate_vnd_unit: retailPerUnit,
                rate_vnd_1k: retailPer1k,
                rate_display: `${retailPerUnit.toLocaleString('vi-VN')} đ`
              };
            });
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify(processed));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(smmData));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message, success: false }));
      }
    });
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(ROOT_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + req.url);
      return;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
}

function startServer(port, host = process.env.HOST || "127.0.0.1") {
  const server = http.createServer(handleRequest);
  server.on("error", (err) => {
    console.log(`Port ${port} error: ${err.message}`);
  });
  server.listen(port, host, () => {
    console.log(`Preview server running at http://localhost:${port}/ and http://127.0.0.1:${port}/`);
  });
  return server;
}

const PORT = parseInt(process.env.PORT || "3000", 10);
startServer(PORT);
