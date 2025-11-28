const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");

const port = process.env.PORT || 3001;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

// TTS Proxy để bypass CORS
function handleTTSProxy(req, res, text) {
  const encodedText = encodeURIComponent(text);

  // Sử dụng Google Translate TTS
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodedText}`;

  const options = {
    hostname: 'translate.google.com',
    path: `/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodedText}`,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://translate.google.com/'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    });
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    console.error('TTS Proxy error:', e.message);
    res.writeHead(500);
    res.end('TTS Error');
  });

  proxyReq.end();
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // TTS API endpoint
  if (pathname === '/api/tts') {
    const text = parsedUrl.query.text || '';
    if (text) {
      handleTTSProxy(req, res, text);
      return;
    }
    res.writeHead(400);
    res.end('Missing text parameter');
    return;
  }

  // Static files
  let filePath = pathname === "/" ? "/index.html" : pathname;
  filePath = path.join(__dirname, filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404 - Không tìm thấy trang</h1>");
      return;
    }
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`🐝 Học Đọc - Đánh Vần Gamestva`);
  console.log(`🎮 Game đang chạy tại: http://localhost:${port}`);
  console.log(`🔊 TTS API: http://localhost:${port}/api/tts?text=xin chào`);
  console.log(`📱 Mở trình duyệt và truy cập địa chỉ trên để chơi!`);
});
