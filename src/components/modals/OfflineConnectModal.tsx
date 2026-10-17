import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { generateQRCodeSVG } from '../../utils/qrCode';
import { 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Radio, 
  Phone, 
  Video, 
  Zap,
  Cable
} from 'lucide-react';

export const OfflineConnectModal: React.FC = () => {
  const { 
    isOfflineModalOpen, 
    setIsOfflineModalOpen, 
    offlineNetworkInfo, 
    setOfflineLanMode,
    roomId, 
    peerId,
    roomPeers,
    startCall,
    testCallSelf,
    setIsManualP2POpen,
    addToast 
  } = useClassroom();

  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedIpIndex, setSelectedIpIndex] = useState(0);

  if (!isOfflineModalOpen) return null;

  const currentPort = offlineNetworkInfo.port || 3000;
  const lanIps = offlineNetworkInfo.lanIps.length > 0 ? offlineNetworkInfo.lanIps : [window.location.hostname];
  const activeIp = lanIps[selectedIpIndex] || lanIps[0];
  const directOfflineUrl = `http://${activeIp}:${currentPort}?room=${roomId}&guest=true`;

  const qrSvg = generateQRCodeSVG(directOfflineUrl, 210, '#38bdf8', '#070b14');

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    addToast('Offline join URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(null), 2200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(4, 7, 16, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(155deg, rgba(15, 23, 42, 0.98), rgba(8, 12, 22, 0.98))',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(14, 165, 233, 0.4)'
              }}
            >
              <Radio size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                Offline & Hotspot Calling Hub
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981'
                }}>
                  0 KB/s Internet Data
                </span>
              </h2>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                Chat, Voice Call, and Video Call between phones and PCs with zero internet connection!
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOfflineModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(56, 189, 248, 0.08))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                  animation: 'pulse 1.5s infinite'
                }}
              />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                  Local Area Network (LAN) Mesh: Ready
                </span>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
                  {offlineNetworkInfo.offlineLanMode 
                    ? 'Using Local Host ICE Candidates (Fastest, zero DNS/STUN lookup lag)' 
                    : 'Hybrid WAN Mode enabled'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setOfflineLanMode(!offlineNetworkInfo.offlineLanMode)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: offlineNetworkInfo.offlineLanMode ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: offlineNetworkInfo.offlineLanMode ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  color: offlineNetworkInfo.offlineLanMode ? '#10b981' : '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                {offlineNetworkInfo.offlineLanMode ? '✓ 100% Offline Mode' : 'Toggle 100% Offline'}
              </button>
            </div>
          </div>

          {/* Quick Connect: QR Code & IP Box */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
              alignItems: 'center'
            }}
          >
            {/* QR Code Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                background: '#070b14',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)'
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  padding: '8px',
                  background: '#070b14',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <QrCode size={14} /> Scan with Any Phone Camera
              </span>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>
                Opens video call & chat immediately without internet
              </p>
            </div>

            {/* Direct Connect & Instructions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Direct Offline Network Address
                </label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="text"
                    readOnly
                    value={directOfflineUrl}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      borderRadius: '12px',
                      color: '#38bdf8',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600
                    }}
                  />
                  <button
                    onClick={() => handleCopy(directOfflineUrl)}
                    style={{
                      padding: '0 16px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copiedUrl === directOfflineUrl ? <Check size={14} /> : <Copy size={14} />}
                    {copiedUrl === directOfflineUrl ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* IP Selection if multiple network interfaces detected */}
              {lanIps.length > 1 && (
                <div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Detected Network Adapters:</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                    {lanIps.map((ip, idx) => (
                      <button
                        key={ip}
                        onClick={() => setSelectedIpIndex(idx)}
                        style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: selectedIpIndex === idx ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                          border: selectedIpIndex === idx ? '1px solid #0ea5e9' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: selectedIpIndex === idx ? '#38bdf8' : '#94a3b8',
                          cursor: 'pointer'
                        }}
                      >
                        {ip} {idx === 0 ? '(Default)' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Instant 2nd Tab Self-Test */}
              <button
                onClick={testCallSelf}
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#c7d2fe',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
              >
                <ExternalLink size={15} color="#818cf8" />
                Test 2-Way Call in 2nd Browser Tab (Right Now)
              </button>

              {/* Air-Gapped Manual WebRTC modal trigger */}
              <button
                onClick={() => {
                  setIsOfflineModalOpen(false);
                  setIsManualP2POpen(true);
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#ddd6fe',
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Cable size={14} color="#a78bfa" />
                Air-Gapped P2P Mode (Zero Server / Code Exchange)
              </button>
            </div>
          </div>

          {/* 3 Simple Steps Guide */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#f59e0b" /> How to use 100% Without Internet:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>STEP 1</span>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '4px 0 0', lineHeight: 1.4 }}>
                  Connect your devices to the <strong>same Wi-Fi router</strong> OR turn on a <strong>Mobile Hotspot</strong> (mobile data can be OFF!).
                </p>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>STEP 2</span>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '4px 0 0', lineHeight: 1.4 }}>
                  Open the <strong>Direct Offline Link</strong> or scan the <strong>QR Code</strong> on the other laptop or mobile phone.
                </p>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>STEP 3</span>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '4px 0 0', lineHeight: 1.4 }}>
                  Start <strong>HD Video Calling, Audio Calling, Group Chatting, and File Sharing</strong> at blazing speed with 0kbps data!
                </p>
              </div>
            </div>
          </div>

          {/* Currently Discovered Local Peers */}
          {roomPeers.length > 0 && (
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                Online Peers on this Local Network ({roomPeers.length}):
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {roomPeers.map(p => (
                  <div
                    key={p.peerId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>{p.name}</span>
                      <code style={{ fontSize: '11px', color: '#38bdf8' }}>{p.peerId}</code>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setIsOfflineModalOpen(false);
                          startCall(p.peerId, p.name, 'audio');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          color: '#60a5fa',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Phone size={12} /> Voice Call
                      </button>
                      <button
                        onClick={() => {
                          setIsOfflineModalOpen(false);
                          startCall(p.peerId, p.name, 'video');
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Video size={12} /> Video Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Room ID: <strong style={{ color: '#94a3b8' }}>{roomId}</strong> • Your ID: <strong style={{ color: '#38bdf8' }}>{peerId}</strong>
          </span>
          <button
            onClick={() => setIsOfflineModalOpen(false)}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
