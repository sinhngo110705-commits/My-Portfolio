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

function generateAIResponse(userText) {
  const lower = (userText || "").toLowerCase();
  
  if (lower.includes("thùy dương") || lower.includes("thuy duong")) {
    return "Trần Thị Thùy Dương (#01 - 96.0 điểm, Tier S+ Apex) là tài năng Khoa học Máy tính tại VKU (GPA 3.61/4.0), cựu chuyên Tin Quốc Học Huế (9.3/10), đạt giải ICPC Quốc gia và Top 6 SheCodes. Dương chuyên sâu thuật toán, C++, Java, Full-Stack Web và Flutter Mobile!";
  }
  if (lower.includes("quang sinh") || lower.includes("sinh") || lower.includes("founder")) {
    return "Lê Thái Trung (#02 - 90.5 điểm, Tier S) là tài năng Kỹ nghệ Phần mềm, còn Ngô Quang Sinh (#03 - 88.0 điểm, Tier A+) là Nhà sáng lập Teemous Digital Lab, sinh viên Digital Marketing tại ĐH Duy Tân. Sinh chuyên kiến trúc Web, tự động hóa AI Workflows, Google AppsScript và phát triển hệ sinh thái số. Bạn có thể liên hệ Sinh qua FB: facebook.com/quang.sinh.5492 hoặc Zalo: 0797747297 nhé!";
  }
  if (lower.includes("thái trung") || lower.includes("thai trung")) {
    return "Lê Thái Trung (#02 - 90.5 điểm, Tier S) là kỹ sư Kỹ nghệ Phần mềm tại ĐH Duy Tân, chuyên về Backend Development, RESTful APIs, IntelliJ IDEA, Postman và Linux/Git.";
  }
  if (lower.includes("bảo hân") || lower.includes("bao han")) {
    return "Bùi Lưu Bảo Hân (#04 - 84.0 điểm, Tier A) là sinh viên Kinh doanh Quốc tế tại ĐH Duy Tân, có thế mạnh về Quản trị Nhân sự (HR), vận hành cộng đồng thanh niên, quản trị dữ liệu với Notion & Google Sheets.";
  }
  if (lower.includes("quang tuấn") || lower.includes("quang tuan") || lower.includes("tuấn")) {
    return "Vương Quang Tuấn (#05 - 80.5 điểm, Tier A) là nhân sự Sáng tạo Nội dung năng động, chuyên thiết kế hình ảnh bằng Canva, dựng video ngắn CapCut, quản trị kênh Fanpage và chạy Facebook Ads cơ bản.";
  }
  if (lower.includes("mẫu") || lower.includes("showcase") || lower.includes("hub") || lower.includes("hồ sơ") || lower.includes("xếp hạng") || lower.includes("tier")) {
    return "Portfolio Hub xếp hạng hồ sơ công tâm dựa trên giá trị thực tế tạo ra cho cộng đồng & sản phẩm thực chiến: S+ Apex (>=95.0), S Professional (90.0-94.9 - Thùy Dương), A+ Impressive (85.0-89.9 - Quang Sinh, Thái Trung), A Standard (80.0-84.9 - Bảo Hân, Quang Tuấn). Bạn bấm mục 'Portfolio Hub' trên menu để xem chi tiết nhé!";
  }
  if (lower.includes("giá") || lower.includes("cost") || lower.includes("price") || lower.includes("bảng giá") || lower.includes("chi phí") || lower.includes("bao nhiêu") || lower.includes("0đ") || lower.includes("free")) {
    return "Hiện tại gói Khởi Tạo Portfolio Cơ Bản đang được TÀI TRỢ 100% SUẤT 0Đ (giá gốc 49k) cho người đăng ký sớm! Gói Khởi Tạo Nâng Cao (Bespoke VIP) hiện đang tạm khóa để remake phiên bản mới. Bạn hãy vào mục SERVICES & SHOP để nhận suất 0đ ngay nha!";
  }
  if (lower.includes("mxh") || lower.includes("smm") || lower.includes("follow") || lower.includes("buff") || lower.includes("like") || lower.includes("tiktok") || lower.includes("facebook") || lower.includes("instagram")) {
    return "Hệ thống SMM của Teemous Digital hỗ trợ tăng like, follow, view, tương tác bài viết cho Facebook, Instagram, Threads, TikTok với giá từ vài chục đồng/tương tác. Tự động lấy UID từ link, bảo mật 100% không cần mật khẩu và nạp tiền tự động qua VietQR!";
  }
  if (lower.includes("aov") || lower.includes("liên quân") || lower.includes("acc") || lower.includes("shop") || lower.includes("nick")) {
    return "Cửa hàng Liên Quân hiện đang tạm ngưng hoạt động để bảo trì hệ thống máy chủ và nâng cấp quy trình giao dịch bảo mật. Bạn vui lòng quay lại sau nhé!";
  }
  if (lower.includes("liên hệ") || lower.includes("contact") || lower.includes("fb") || lower.includes("admin") || lower.includes("zalo")) {
    return "Bạn có thể liên hệ trực tiếp với Quang Sinh qua Facebook: facebook.com/quang.sinh.5492, Zalo: 0797747297 hoặc email: teemous.contact@gmail.com nha!";
  }
  if (lower.includes("dịch vụ") || lower.includes("service") || lower.includes("làm gì") || lower.includes("portfolio")) {
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

        const action = params.action || (reqPath.includes('services') ? 'services' : 'balance');
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
          const margin = 1.20; // 20% lợi nhuận cho chủ shop
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

function startServer(port) {
  const server = http.createServer(handleRequest);
  server.on('error', (err) => {
    console.log(`Port ${port} error: ${err.message}`);
  });
  server.listen(port, '0.0.0.0', () => {
    console.log(`Preview server running at http://localhost:${port}/ and http://127.0.0.1:${port}/`);
  });
  return server;
}

startServer(3000);
startServer(1234);
