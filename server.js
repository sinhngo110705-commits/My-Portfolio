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

function generateAIResponse(userText) {
  const raw = (userText || "").toLowerCase();
  const clean = removeAccents(userText);
  
  if (clean.includes("thuy duong") || clean.includes("duong")) {
    return "Trần Thị Thùy Dương (#01 - 96.0 điểm, Tier S+ Apex) là tài năng Khoa học Máy tính tại VKU (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế (9.3/10), đạt giải ICPC Quốc gia và Top 6 SheCodes. Dương chuyên sâu thuật toán, C++, Java, Full-Stack Web và Flutter Mobile!";
  }
  if (clean.includes("thai trung") || clean.includes("trung")) {
    return "Lê Thái Trung (#02 - 90.5 điểm, Tier S Professional) là kỹ sư Kỹ nghệ Phần mềm tại ĐH Duy Tân, chuyên về Backend Development, RESTful APIs, IntelliJ IDEA, Postman và Linux/Git.";
  }
  if (clean.includes("quang sinh") || clean.includes("sinh") || clean.includes("founder")) {
    return "Ngô Quang Sinh (#03 - 88.0 điểm, Tier A+ Impressive) là Nhà sáng lập Teemous Digital Lab, sinh viên Digital Marketing tại ĐH Duy Tân. Sinh chuyên kiến trúc Web, tự động hóa AI Workflows, Google AppsScript và phát triển hệ sinh thái số. Bạn có thể liên hệ Sinh qua FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297 nhé!";
  }
  if (clean.includes("bao han") || clean.includes("han")) {
    return "Bùi Lưu Bảo Hân (#04 - 84.0 điểm, Tier A Standard) là sinh viên Kinh doanh Quốc tế tại ĐH Duy Tân, có thế mạnh về Quản trị Nhân sự (HR), vận hành cộng đồng thanh niên, quản trị dữ liệu với Notion & Google Sheets.";
  }
  if (clean.includes("quang tuan") || clean.includes("tuan")) {
    return "Vương Quang Tuấn (#05 - 80.5 điểm, Tier A Standard) là nhân sự Sáng tạo Nội dung năng động, chuyên thiết kế hình ảnh bằng Canva, dựng video ngắn CapCut, quản trị kênh Fanpage và chạy Facebook Ads cơ bản.";
  }
  if (clean.includes("mau") || clean.includes("showcase") || clean.includes("hub") || clean.includes("ho so") || clean.includes("xep hang") || clean.includes("tier") || clean.includes("bac")) {
    return "Portfolio Hub xếp hạng hồ sơ công tâm dựa trên giá trị thực tế tạo ra cho cộng đồng & sản phẩm thực chiến: S+ Apex (>=95.0 - Thùy Dương), S Professional (90.0-94.9 - Thái Trung), A+ Impressive (85.0-89.9 - Quang Sinh), A Standard (80.0-84.9 - Bảo Hân, Quang Tuấn). Bạn bấm mục 'Portfolio Hub' trên menu để xem chi tiết nhé!";
  }
  if (clean.includes("gia") || clean.includes("cost") || clean.includes("price") || clean.includes("bang gia") || clean.includes("chi phi") || clean.includes("bao nhieu") || clean.includes("0d") || clean.includes("free")) {
    return "Hiện tại gói Khởi Tạo Portfolio Cơ Bản đang được TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) cho người đăng ký sớm! Gói Khởi Tạo Nâng Cao (Bespoke VIP) hiện đang tạm khóa để remake phiên bản mới. Bạn hãy vào mục SERVICES & SHOP để nhận suất 0đ ngay nha!";
  }
  if (clean.includes("mxh") || clean.includes("smm") || clean.includes("follow") || clean.includes("buff") || clean.includes("like") || clean.includes("tiktok") || clean.includes("facebook") || clean.includes("instagram")) {
    return "Hệ thống SMM của Teemous Digital hỗ trợ tăng like, follow, view, tương tác bài viết cho Facebook, Instagram, Threads, TikTok với giá từ vài chục đồng/tương tác. Tự động lấy UID từ link, bảo mật 100% không cần mật khẩu và nạp tiền tự động qua VietQR!";
  }
  if (clean.includes("aov") || clean.includes("lien quan") || clean.includes("acc") || clean.includes("shop") || clean.includes("nick")) {
    return "Cửa hàng Liên Quân hiện đang tạm ngưng hoạt động để bảo trì hệ thống máy chủ và nâng cấp quy trình giao dịch bảo mật. Bạn vui lòng quay lại sau nhé!";
  }
  if (clean.includes("lien he") || clean.includes("contact") || clean.includes("fb") || clean.includes("admin") || clean.includes("zalo")) {
    return "Bạn có thể liên hệ trực tiếp với Quang Sinh qua Facebook: facebook.com/quang.sinh.5492, Zalo: 0797747297 hoặc email: teemous.contact@gmail.com nha!";
  }
  if (clean.includes("dich vu") || clean.includes("service") || clean.includes("lam gi") || clean.includes("portfolio")) {
    return "Teemous Digital cung cấp các dịch vụ: Khởi tạo Portfolio cá nhân (đang có suất tài trợ 0đ), Dịch vụ tăng trưởng Mạng Xã Hội SMM (Facebook, TikTok, Instagram) và Tự động hóa công cụ AI. Bạn cần mình tư vấn mục nào nhất?";
  }
  return "Chào bạn! Mình là Teemous AI, trợ lý số của Teemous Digital Lab. Mình có thể hỗ trợ tư vấn nhận suất làm Portfolio 0đ, tra cứu hồ sơ Portfolio Hub, dịch vụ buff tương tác MXH hay kết nối trực tiếp với Founder Quang Sinh. Bạn cần mình hỗ trợ gì nè?";
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
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const userMsg = (body.messages && body.messages.length > 0)
          ? body.messages[body.messages.length - 1].content
          : '';
        const reply = generateAIResponse(userMsg);
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
    req.on('end', () => {
      try {
        const body = JSON.parse(bodyStr || '{}');
        const userMsg = (body.messages && body.messages.length > 0)
          ? body.messages[body.messages.length - 1].content
          : '';
        const reply = generateAIResponse(userMsg);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ content: reply }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
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
          const margin = 1.20;
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
