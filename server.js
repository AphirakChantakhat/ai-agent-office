const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3333;
const ROOT = __dirname;
const STATE_FILE = path.join(ROOT, '.agents', 'state', 'team_status.json');

// Store active SSE clients
const sseClients = new Set();

// Watch state file for real-time live push
if (fs.existsSync(STATE_FILE)) {
  fs.watchFile(STATE_FILE, { interval: 500 }, () => {
    try {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      const payload = `data: ${JSON.stringify(JSON.parse(content))}\n\n`;
      for (const res of sseClients) {
        res.write(payload);
      }
    } catch (err) {
      // ignore transient read errors
    }
  });
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // SSE Live Stream Endpoint
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');
    sseClients.add(res);

    // Send initial state immediately
    if (fs.existsSync(STATE_FILE)) {
      try {
        const initial = fs.readFileSync(STATE_FILE, 'utf-8');
        res.write(`data: ${JSON.stringify(JSON.parse(initial))}\n\n`);
      } catch (e) {}
    }

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // Serve static files
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '/index.html') {
    reqPath = '/office_dashboard.html';
  }

  const filePath = path.join(ROOT, decodeURIComponent(reqPath));

  // Security check: ensure path is within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('File Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.json': 'application/json; charset=utf-8',
      '.css': 'text/css',
      '.js': 'application/javascript'
    };

    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

// Handle errors gracefully (e.g. port already running)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n=======================================================`);
    console.log(`ℹ️  AI Agent Office Server กำลังทำงานอยู่แล้วที่พอร์ต ${PORT}!`);
    console.log(`👉 กำลังเปิดหน้าต่างเบราว์เซอร์ไปยัง http://localhost:${PORT} ให้อัตโนมัติ...`);
    console.log(`=======================================================\n`);
    exec(`start http://localhost:${PORT}`);
    setTimeout(() => process.exit(0), 1200);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏢 Chantakhat A. • AI Agent Office Server is LIVE!`);
  console.log(`👉 URL: http://localhost:${PORT}`);
  console.log(`⚡ Real-time SSE Live Stream connected (Auto-Sync)`);
  console.log(`=======================================================`);

  // Open default browser on Windows
  exec(`start http://localhost:${PORT}`);
});
