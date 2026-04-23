const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BACKEND_URL = 'http://host.docker.internal:5001';

const logFile = path.join(__dirname, 'gateway.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - GATEWAY - ${message}\n`;
    console.log(logMessage.trim());
    logStream.write(logMessage);
}

function corsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function makeRequest(method, url, data = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

const server = http.createServer(async (req, res) => {
    log(`${req.method} ${req.url} - ${req.socket.remoteAddress}`);
    
    corsHeaders(res);
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    try {
        if (req.url === '/' || req.url === '/index.html') {
            const filePath = path.join(__dirname, '../frontend/index.html');
            const html = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        if (req.url === '/app.js') {
            const filePath = path.join(__dirname, '../frontend/app.js');
            const js = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(js);
            return;
        }

        if (req.url.startsWith('/api/')) {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', async () => {
                try {
                    let parsedBody = null;
                    if (body && req.method === 'POST') {
                        parsedBody = JSON.parse(body);
                    }

                    const backendUrl = BACKEND_URL + req.url;
                    log(`Forwarding ${req.method} ${req.url} to backend`);
                    
                    const result = await makeRequest(req.method, backendUrl, parsedBody);
                    res.writeHead(result.status, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.data));
                } catch (error) {
                    log(`Error forwarding to backend: ${error.message}`);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Backend service unavailable' }));
                }
            });
            return;
        }

        res.writeHead(404);
        res.end('Not Found');
        
    } catch (error) {
        log(`Server error: ${error.message}`);
        res.writeHead(500);
        res.end('Internal Server Error');
    }
});

server.listen(PORT, () => {
    log(`API Gateway running on port ${PORT}`);
    log(`Open http://localhost:${PORT} to access the application`);
});
