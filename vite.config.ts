import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { WebSocketServer, WebSocket } from 'ws'
import os from 'os'

function getLocalIpAddresses(): string[] {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }

  // Fallback to localhost if no external LAN interface found
  if (addresses.length === 0) {
    addresses.push('127.0.0.1');
  }

  return addresses;
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'webrtc-signaling-server',
      configureServer(server) {
        // Expose HTTP endpoint for local network discovery
        server.middlewares.use('/api/network-info', (req, res) => {
          if (req.method === 'GET') {
            const ips = getLocalIpAddresses();
            const port = server.config.server.port || 3000;
            const urls = ips.map(ip => `http://${ip}:${port}`);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              lanIps: ips,
              port,
              urls,
              offlineReady: true,
              timestamp: Date.now()
            }));
            return;
          }
        });

        if (!server.httpServer) return;

        const wss = new WebSocketServer({ 
          server: server.httpServer as any,
          path: '/webrtc-signal'
        });

        // Map: socket -> client info
        const clients = new Map<WebSocket, { roomId: string; peerId: string; name: string }>();

        wss.on('connection', (ws) => {
          // Immediately provide local network IP information for offline devices
          const ips = getLocalIpAddresses();
          const port = server.config.server.port || 3000;
          ws.send(JSON.stringify({
            type: 'network-info',
            lanIps: ips,
            port,
            urls: ips.map(ip => `http://${ip}:${port}`)
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

                // Find existing peers in this room
                const existingPeers: Array<{ peerId: string; name: string }> = [];
                for (const [clientSocket, info] of clients.entries()) {
                  if (clientSocket !== ws && info.roomId === msg.roomId && clientSocket.readyState === WebSocket.OPEN) {
                    existingPeers.push({ peerId: info.peerId, name: info.name });
                    // Notify existing peer about the new peer
                    clientSocket.send(JSON.stringify({
                      type: 'peer-joined',
                      peerId: msg.peerId,
                      name: msg.name || 'Friend'
                    }));
                  }
                }

                // Send list of current peers back to new peer
                ws.send(JSON.stringify({
                  type: 'room-peers',
                  peers: existingPeers
                }));

                console.log(`[WebRTC Signal] Peer ${msg.peerId} (${msg.name}) joined room ${msg.roomId}`);

              } else if (msg.targetPeerId) {
                // Direct message routing (call-invite, call-accept, call-decline, call-cancel, call-end, signal, direct-chat)
                const senderInfo = clients.get(ws);
                let delivered = false;
                for (const [clientSocket, info] of clients.entries()) {
                  if (info.peerId === msg.targetPeerId && clientSocket.readyState === WebSocket.OPEN) {
                    clientSocket.send(JSON.stringify({
                      ...msg,
                      senderPeerId: msg.senderPeerId || senderInfo?.peerId,
                      senderName: msg.senderName || senderInfo?.name || 'Friend'
                    }));
                    delivered = true;
                    break;
                  }
                }
                if (!delivered) {
                  console.log(`[WebRTC Signal] Target peer ${msg.targetPeerId} not found or disconnected`);
                }

              } else if (msg.type === 'broadcast') {
                // Broadcast to all other peers in the room (chat, files, reactions, poll, walkie-talkie)
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
              console.error('[WebRTC Signal] Error handling message:', err);
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
              console.log(`[WebRTC Signal] Peer ${senderInfo.peerId} left room ${senderInfo.roomId}`);
            }
          });
        });

        console.log('[WebRTC Signaling] Offline LAN & Real-Time Signaling Server attached to /webrtc-signal');
      }
    }
  ],
  server: {
    port: 3000,
    host: true
  }
})
