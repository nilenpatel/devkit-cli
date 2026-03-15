const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.pdf': 'application/pdf',
};

function serve(args) {
  let port = 3000;
  let dir = '.';

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--port' || args[i] === '-p') && args[i + 1]) {
      port = parseInt(args[++i], 10);
    } else if (!args[i].startsWith('-')) {
      dir = args[i];
    }
  }

  const root = path.resolve(dir);

  const server = http.createServer((req, res) => {
    let filePath = path.join(root, decodeURIComponent(req.url));
    if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');

    // Prevent directory traversal
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath);
      const mime = MIME[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.listen(port, () => {
    console.log(`\n  Serving ${root}`);
    console.log(`  http://localhost:${port}`);
    console.log('  Press Ctrl+C to stop.\n');
  });
}

module.exports = serve;
