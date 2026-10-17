# VC-CP — Offline LAN Chatting & Calling Platform

A modern, high-performance **Offline Local Area Network (LAN) Calling, Video Conferencing, and Chatting Platform** built with **React 19**, **TypeScript**, **Vite**, **Native WebRTC**, and **WebSockets**.

> 🟢 **Works 100% Without Internet!**
> Connect phones, laptops, and tablets on the same Wi-Fi router or Mobile Hotspot (with mobile data turned off) and chat, voice call, video call, and share files at blazing speeds with **0 KB/s internet data usage**.

---

## ⚡ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Offline Signaling Server**: Vite + WebSocket Server (attached to local dev server)
- **Peer-to-Peer Protocol**: Native WebRTC (Host ICE Candidates + RTCDataChannel P2P Mesh)
- **Offline QR Code Generator**: Zero-dependency Pure SVG Model-2 QR Matrix Engine
- **Icons**: Lucide React
- **Audio Synthesizer**: Web Audio API (real-time generated ringtones and notification chimes)
- **Styling**: Vanilla CSS with modern Glassmorphic Cyber Slate Design System

---

## 📡 100% Without-Internet Calling & Chatting Features

1. **Offline & Hotspot Calling Hub**:
   - **Local IP Auto-Discovery**: Automatically queries `os.networkInterfaces()` and displays direct LAN URLs (e.g. `http://192.168.x.x:3000`).
   - **Live SVG QR Code**: Scan with any mobile phone camera on the same Wi-Fi/Hotspot to join the room instantly without typing.
   - **0kbps Host Candidate ICE Profile**: Configures WebRTC to skip slow DNS/STUN server lookups when offline, establishing connections in milliseconds.

2. **Real-Time Calling Modes**:
   - **HD Video Call**: Stream camera and microphone across devices over local network bandwidth.
   - **Voice Call (Audio Only)**: Low-bandwidth crystal-clear voice communication.
   - **Walkie-Talkie Push-to-Talk (PTT)**: Press and hold to broadcast instant voice audio across all connected local peers without dialing.
   - **Native Screen Sharing**: Stream slides, windows, and entire desktops locally without internet lag.

3. **Offline Group & Direct Chat**:
   - **Classroom Chat**: Broadcast messages to everyone in the offline room.
   - **Direct (1-on-1) Messaging**: Send private messages to specific connected colleagues.
   - **Offline P2P File Sharing**: Share documents, slides, images, and notes directly over local network / RTCDataChannel with instant download.
   - **Interactive Q&A Board & Live Polls**: Real-time upvoting, marking answered, and voting.

4. **Air-Gapped WebRTC P2P (Zero-Server Mode)**:
   - For air-gapped security or situations where devices cannot reach a central signaling server, users can exchange raw SDP Offer/Answer codes or QR codes for direct browser-to-browser P2P calls.

---

## 🚀 How to Run Offline (3 Easy Steps)

### Step 1: Start the Local Platform
```bash
npm install
npm start
# OR for Vite dev:
npm run dev
```

### Step 2: Connect Devices to Same Local Network
- **Option A (Mobile Hotspot)**: Turn on Mobile Hotspot on your phone or laptop (mobile data can be turned **OFF**!). Connect other phones or laptops to this hotspot Wi-Fi.
- **Option B (Home/Office Wi-Fi)**: Connect all devices to the same local Wi-Fi router (even if the WAN cable or internet is disconnected).

### Step 3: Scan QR Code or Open LAN URL
Click **"Offline Hub & QR"** in the top navigation bar or look at your terminal output:
- Open `http://<YOUR_LOCAL_IP>:3000` (e.g., `http://192.168.137.1:3000`) or scan the QR Code on any phone.
- Start calling, chatting, and collaborating with zero internet!
