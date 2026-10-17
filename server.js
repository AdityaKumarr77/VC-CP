import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  if (addresses.length === 0) addresses.push('127.0.0.1');
  return addresses;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // API endpoint
  if (url.pathname === '/api/network-info') {
    const ips = getLocalIpAddresses();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      lanIps: ips,
      port: PORT,
      urls: ips.map(ip => `http://${ip}:${PORT}`),
      offlineReady: true
    }));
    return;
  }

  // Static file serving from dist/
  let filePath = path.join(DIST_DIR, url.pathname);

  // If path is a directory or root, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // SPA fallback
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading ' + filePath);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

// Attach WebRTC Signaling WebSocket Server
const wss = new WebSocketServer({ server, path: '/webrtc-signal' });
const clients = new Map();

wss.on('connection', (ws) => {
  const ips = getLocalIpAddresses();
  ws.send(JSON.stringify({
    type: 'network-info',
    lanIps: ips,
    port: PORT,
    urls: ips.map(ip => `http://${ip}:${PORT}`)
  }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === 'join') {
        clients.set(ws, {
          roomId: msg.roomId,
          peerId: msg.peerId,
          name: msg.name || 'Friend'
        });

        const existingPeers = [];
        for (const [clientSocket, info] of clients.entries()) {
          if (clientSocket !== ws && info.roomId === msg.roomId && clientSocket.readyState === WebSocket.OPEN) {
            existingPeers.push({ peerId: info.peerId, name: info.name });
            clientSocket.send(JSON.stringify({
              type: 'peer-joined',
              peerId: msg.peerId,
              name: msg.name || 'Friend'
            }));
          }
        }

        ws.send(JSON.stringify({
          type: 'room-peers',
          peers: existingPeers
        }));

      } else if (msg.targetPeerId) {
        const senderInfo = clients.get(ws);
        for (const [clientSocket, info] of clients.entries()) {
          if (info.peerId === msg.targetPeerId && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
              ...msg,
              senderPeerId: msg.senderPeerId || senderInfo?.peerId,
              senderName: msg.senderName || senderInfo?.name || 'Friend'
            }));
            break;
          }
        }

      } else if (msg.type === 'broadcast') {
        const senderInfo = clients.get(ws);
        if (!senderInfo) return;
        for (const [clientSocket, info] of clients.entries()) {
          if (clientSocket !== ws && info.roomId === senderInfo.roomId && clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
              ...msg,
              senderPeerId: senderInfo.peerId,
              senderName: senderInfo.name
            }));
          }
        }
      }
    } catch (err) {
      console.error('[WebRTC Signal Error]:', err);
    }
  });

  ws.on('close', () => {
    const senderInfo = clients.get(ws);
    if (senderInfo) {
      for (const [clientSocket, info] of clients.entries()) {
        if (clientSocket !== ws && info.roomId === senderInfo.roomId && clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            type: 'peer-left',
            peerId: senderInfo.peerId
          }));
        }
      }
      clients.delete(ws);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log(`\n======================================================`);
  console.log(`📡 Offline LAN Calling & Chatting Platform Ready!`);
  console.log(`➜ Local URL:       http://localhost:${PORT}`);
  ips.forEach(ip => {
    console.log(`➜ Local Network:   http://${ip}:${PORT}`);
  });
  console.log(`======================================================\n`);
});
