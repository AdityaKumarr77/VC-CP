import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { VideoTile } from './VideoTile';
import { CallControlBar } from './CallControlBar';
import { 
  PhoneCall, 
  ExternalLink, 
  Copy, 
  Check, 
  Bot, 
  ShieldCheck 
} from 'lucide-react';

export const GalleryGrid: React.FC = () => {
  const { 
    currentUser, 
    participants, 
    roomId, 
    startCall, 
    testCallSelf, 
    addDemoBots, 
    addToast
  } = useClassroom();

  const [inputPeerId, setInputPeerId] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const allUsers = [currentUser, ...participants];
  const isSolo = participants.length === 0;

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    addToast('Direct video call link copied! Send to a friend to connect.', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPeerId.trim()) return;
    startCall(inputPeerId.trim(), 'Friend (' + inputPeerId.trim().slice(-4) + ')');
    setInputPeerId('');
  };

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Calling Bar */}
      <CallControlBar />

      {/* Main Grid or Calling Hub */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        {!isSolo ? (
          // Active Conference Grid
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gap: '14px',
              gridTemplateColumns: allUsers.length === 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(320px, 1fr))',
              gridAutoRows: '1fr',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {allUsers.map(p => (
              <VideoTile key={p.id} participant={p} />
            ))}
          </div>
        ) : (
          // Solo Waiting Hub: Left = Live Camera Preview, Right = Interactive Calling Station
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '16px',
              alignItems: 'stretch'
            }}
          >
            {/* Left: Your Live Camera Tile */}
            <div style={{ height: '100%', position: 'relative' }}>
              <VideoTile participant={currentUser} />
            </div>

            {/* Right: Calling Facility Hub */}
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8), rgba(7, 11, 20, 0.95))',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'blur(16px)',
                overflowY: 'auto'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                    display: 'inline-block'
                  }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Calling Facility Ready
                  </span>
                </div>

                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 6px 0' }}>
                  Connect Live with Friends
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                  This platform runs real P2P WebRTC audio & video streams. You can call another device or open a second tab to test the 2-way call immediately.
                </p>

                {/* Direct Dial Input */}
                <form onSubmit={handleDial} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                    DIAL FRIEND BY PEER ID:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. user_8d9a"
                      value={inputPeerId}
                      onChange={e => setInputPeerId(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!inputPeerId.trim()}
                      style={{
                        padding: '10px 18px',
                        background: inputPeerId.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-card)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        color: inputPeerId.trim() ? '#fff' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: inputPeerId.trim() ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: inputPeerId.trim() ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
                      }}
                    >
                      <PhoneCall size={15} />
                      <span>Call</span>
                    </button>
                  </div>
                </form>

                {/* Two Action Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {/* Card 1: Test Call in 2nd Tab */}
                  <div
                    onClick={testCallSelf}
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.22)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 700, fontSize: '13px' }}>
                        <ExternalLink size={15} />
                        <span>Instant 2-Device Call Test</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                        Opens a 2nd window with a friend profile to test real 2-way WebRTC calling.
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: 'var(--accent-primary)',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      Test Now
                    </span>
                  </div>

                  {/* Card 2: Copy Direct Link */}
                  <div
                    onClick={handleCopy}
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.18)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '13px' }}>
                        {copiedLink ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
                        <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Room Link'}</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                        Send to friends or open on your mobile phone to connect.
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: 'rgba(6, 182, 212, 0.2)',
                      color: 'var(--accent-cyan)',
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      Copy Link
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Info Bar */}
              <div style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="#10b981" />
                  <span>STUN/WebRTC Active</span>
                </div>

                {/* Optional AI Bot Classmate button */}
                <button
                  onClick={addDemoBots}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'none',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-secondary)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                  title="Adds AI demo classmates if you want to test Whiteboard or Polls solo"
                >
                  <Bot size={13} />
                  <span>Practice AI Peers</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
