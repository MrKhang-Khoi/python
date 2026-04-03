const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ============ ĐỌC .ENV (không cần npm) ============
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env');
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const [key, ...vals] = trimmed.split('=');
            process.env[key.trim()] = vals.join('=').trim();
        }
    } catch (e) {
        console.warn('⚠️  Không tìm thấy file .env — dùng giá trị mặc định');
    }
}
loadEnv();

const PORT = parseInt(process.env.PORT) || 8080;

// ============ BẢO MẬT ============
// Mật khẩu đọc từ .env — KHÔNG hardcode trong source code
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD;
if (!TEACHER_PASSWORD) {
    console.error('❌ LỖI: Chưa cấu hình TEACHER_PASSWORD trong file .env!');
    console.error('   Tạo file .env theo mẫu .env.example');
    process.exit(1);
}

// Hash function giống client-side
function sha256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

// Tạo token ngẫu nhiên cho session
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Lưu session tokens (in-memory)
const activeSessions = new Map();

// Dọn session hết hạn mỗi 30 phút
setInterval(() => {
    const now = Date.now();
    for (const [token, data] of activeSessions) {
        if (now - data.created > 8 * 3600 * 1000) { // 8 giờ hết hạn
            activeSessions.delete(token);
        }
    }
}, 30 * 60 * 1000);

// ============ MIME TYPES ============
const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'
};

// ============ SERVER ============
http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    
    // ===== API: Xác thực giáo viên =====
    if (url.pathname === '/api/auth' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { passwordHash } = JSON.parse(body);
                const correctHash = sha256(TEACHER_PASSWORD);
                
                if (passwordHash === correctHash) {
                    const token = generateToken();
                    activeSessions.set(token, { 
                        created: Date.now(), 
                        role: 'teacher' 
                    });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: true, token }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: false, error: 'Mật khẩu sai!' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, error: 'Invalid request' }));
            }
        });
        return;
    }
    
    // ===== API: Kiểm tra session =====
    if (url.pathname === '/api/verify' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { token } = JSON.parse(body);
                const session = activeSessions.get(token);
                if (session && (Date.now() - session.created < 8 * 3600 * 1000)) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: true, role: session.role }));
                } else {
                    activeSessions.delete(token);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ ok: false, error: 'Session hết hạn' }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: false, error: 'Invalid request' }));
            }
        });
        return;
    }

    // ===== API: Đăng xuất =====
    if (url.pathname === '/api/logout' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { token } = JSON.parse(body);
                activeSessions.delete(token);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (e) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            }
        });
        return;
    }
    
    // ===== Static files =====
    let filePath = path.join(__dirname, url.pathname === '/' ? 'index.html' : url.pathname);
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
    console.log('   THEMIS ONLINE JUDGE - Secure Server');
    console.log('  ==========================================');
    console.log(`  Server: http://localhost:${PORT}`);
    console.log(`  Active sessions: ${activeSessions.size}`);
    console.log('  Nhan Ctrl+C de dung server');
    console.log('');
});
