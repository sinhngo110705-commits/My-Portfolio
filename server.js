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
        if (val.startsWith(""") && val.endsWith(""")) val = val.slice(1, -1);
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
  const lower = (userText || '').toLowerCase();
  if (lower.includes('giá') || lower.includes('portfolio') || lower.includes('cost') || lower.includes('price') || lower.includes('bảng giá')) {
    return "Gói khởi tạo Portfolio Basic đang ưu đãi chỉ 49k (đã giảm 75%), gói Advanced từ 300k tùy biến theo nhu cầu tên miền riêng (.vn / .com). Bạn có thể vào mục SERVICES để chọn gói nhé!";
  }
  if (lower.includes('aov') || lower.includes('liên quân') || lower.includes('acc') || lower.includes('shop') || lower.includes('nick')) {
    return "Cửa hàng Liên Quân hiện có acc #AOV-001 (999k - Murad Chí Tôn) và #AOV-002 (678k - Yena Wave). Tất cả đều bảo kê liên kết an toàn 100% qua admin Quang Sinh!";
  }
  if (lower.includes('liên hệ') || lower.includes('contact') || lower.includes('fb') || lower.includes('facebook') || lower.includes('sinh') || lower.includes('admin')) {
    return "Bạn có thể liên hệ trực tiếp với Quang Sinh qua Facebook cá nhân: facebook.com/quang.sinh.5492 hoặc bấm 'Contact Us' trên thanh menu nha!";
  }
  if (lower.includes('dịch vụ') || lower.includes('service') || lower.includes('làm gì')) {
    return "Teemous Digital cung cấp các dịch vụ: Khởi tạo Portfolio Hub cá nhân, Tối ưu & Curation hồ sơ, Dịch vụ trọn gói The Carry Pack, Tăng trưởng MXH và Cửa hàng Liên Quân. Bạn quan tâm dịch vụ nào nhất?";
  }
  return "Chào bạn! Mình là Teemous AI (Trợ lý ảo của Quang Sinh). Mình có thể hỗ trợ tư vấn dịch vụ làm Portfolio, thông tin Shop Liên Quân hay kết nối trực tiếp với Sinh. Bạn cần mình giúp gì nè?";
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
