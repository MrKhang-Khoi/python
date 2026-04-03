const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8080;

const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'
};

http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log('');
    console.log('  ==========================================');
    console.log('   THEMIS ONLINE JUDGE - Local Server');
    console.log('  ==========================================');
    console.log(`  Server: http://localhost:${PORT}`);
    console.log('  Nhan Ctrl+C de dung server');
    console.log('');
});
