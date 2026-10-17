import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { 
  Phone, 
  PhoneOff, 
  Video,
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Users, 
  Radio, 
  Bluetooth,
  QrCode,
  Mic,
  Volume2
} from 'lucide-react';

export const CallControlBar: React.FC = () => {
  const { 
    peerId, 
    roomId, 
    isInCall, 
    callDuration, 
    roomPeers, 
    startCall, 
    endCall, 
    testCallSelf,
    requestBluetoothDevice,
    setIsOfflineModalOpen,
    isWalkieTalkieActive,
    walkieTalkieBroadcaster,
    startWalkieTalkie,
    stopWalkieTalkie,
    addToast 
  } = useClassroom();

  const [dialTarget, setDialTarget] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(peerId);
    setCopiedId(true);
    addToast(`Copied your Call ID: ${peerId}`, 'success');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    addToast('Direct conference room link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDial = (e: React.FormEvent, callType: 'video' | 'audio' = 'video') => {
    e.preventDefault();
    if (!dialTarget.trim()) return;
    startCall(dialTarget.trim(), 'Peer ' + dialTarget.trim().slice(-4), callType);
    setDialTarget('');
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        width: '100%',
        padding: '10px 16px',
        marginBottom: '10px',
        background: 'rgba(13, 20, 36, 0.88)',
        backdropFilter: 'blur(16px)',
        border: isInCall ? '1.5px solid rgba(16, 185, 129, 0.55)' : '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: isInCall ? '0 4px 20px rgba(16, 185, 129, 0.2)' : 'var(--shadow-sm)'
      }}
    >
      {/* Left: Identity & Offline Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setIsOfflineModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            background: isInCall ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)',
            border: isInCall ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)',
            cursor: 'pointer'
          }}
          title="Click to view QR Code & Offline LAN addresses"
        >
          <Radio size={14} color={isInCall ? '#10b981' : '#38bdf8'} className={isInCall ? 'pulse-anim' : ''} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: isInCall ? '#10b981' : '#38bdf8' }}>
            {isInCall ? 'LIVE CALL CONNECTED' : 'OFFLINE LAN READY'}
          </span>
          <QrCode size={13} color={isInCall ? '#10b981' : '#38bdf8'} style={{ marginLeft: '2px' }} />
        </button>

        {/* My Peer ID Tag */}
        <button
          onClick={handleCopyId}
          title="Click to copy your personal Calling ID"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>My ID:</span>
          <code style={{ color: '#38bdf8', fontWeight: 700 }}>{peerId}</code>
          {copiedId ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
        </button>

        {/* Room Link Tag */}
        <button
          onClick={handleCopyLink}
          title="Copy direct room invite link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          <Users size={12} color="var(--accent-cyan)" />
          <span>Room: <strong style={{ color: '#fff' }}>{roomId}</strong></span>
          {copiedLink ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Center: In-Call Duration / Dialer & Walkie-Talkie */}
      {isInCall ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-full)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', letterSpacing: '0.5px' }}>
              {formatDuration(callDuration)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>Offline LAN WebRTC P2P</span>
          </div>

          <button
            onClick={endCall}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
            }}
          >
            <PhoneOff size={14} />
            <span>End Call</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Dial input */}
          <form onSubmit={e => handleDial(e, 'video')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="text"
              placeholder="Dial Peer ID (e.g. user_x9y2)"
              value={dialTarget}
              onChange={e => setDialTarget(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                outline: 'none',
                width: '170px'
              }}
            />
            {/* Audio Call */}
            <button
              type="button"
              onClick={e => handleDial(e, 'audio')}
              disabled={!dialTarget.trim()}
              title="Voice-Only Call (low bandwidth)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: dialTarget.trim() ? 'rgba(59, 130, 246, 0.25)' : 'var(--bg-card)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: dialTarget.trim() ? '#60a5fa' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: dialTarget.trim() ? 'pointer' : 'default'
              }}
            >
              <Phone size={12} />
              <span>Voice</span>
            </button>
            {/* Video Call */}
            <button
              type="submit"
              disabled={!dialTarget.trim()}
              title="HD Video Call"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: dialTarget.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--bg-card)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: dialTarget.trim() ? '#fff' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: 700,
                cursor: dialTarget.trim() ? 'pointer' : 'default',
                boxShadow: dialTarget.trim() ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              <Video size={12} />
              <span>Video</span>
            </button>
          </form>

          {/* Walkie-Talkie Push-to-Talk (PTT) Button */}
          <button
            onMouseDown={startWalkieTalkie}
            onMouseUp={stopWalkieTalkie}
            onTouchStart={startWalkieTalkie}
            onTouchEnd={stopWalkieTalkie}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              background: isWalkieTalkieActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.15)',
              border: isWalkieTalkieActive ? '1px solid #ef4444' : '1px solid rgba(245, 158, 11, 0.4)',
              color: isWalkieTalkieActive ? '#fca5a5' : '#fbbf24',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              userSelect: 'none'
            }}
            title="Press & hold to broadcast voice to all connected local peers instantly (Push-To-Talk)"
          >
            <Mic size={13} className={isWalkieTalkieActive ? 'animate-pulse' : ''} />
            <span>{isWalkieTalkieActive ? 'BROADCASTING...' : 'Hold Walkie-Talkie (PTT)'}</span>
          </button>
        </div>
      )}

      {/* Right: Quick Actions & Companion Tab */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* If peers in room, show quick dial button */}
        {!isInCall && roomPeers.length > 0 && (
          <div style={{ display: 'flex', gap: '6px' }}>
            {roomPeers.map(p => (
              <div key={p.peerId} style={{ display: 'flex', gap: '2px' }}>
                <button
                  onClick={() => startCall(p.peerId, p.name, 'audio')}
                  title={`Voice Call ${p.name}`}
                  style={{
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60a5fa',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Phone size={11} />
                </button>
                <button
                  onClick={() => startCall(p.peerId, p.name, 'video')}
                  title={`Video Call ${p.name}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 10px',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    borderLeft: 'none',
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Video size={11} />
                  <span>Call {p.name.split(' ')[0]}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Instant 2-way call test button */}
        <button
          onClick={testCallSelf}
          title="Opens a 2nd browser tab so you can test real 2-way WebRTC video & audio calling on your machine!"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}
        >
          <ExternalLink size={12} />
          <span>Test Call in 2nd Tab</span>
        </button>

        {/* Bluetooth Pairing Button */}
        <button
          onClick={requestBluetoothDevice}
          title="Scan & pair Bluetooth headphones/mic"
          style={{
            padding: '5px 8px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Bluetooth size={14} color="#38bdf8" />
        </button>
      </div>

      {/* Broadcast listener banner if someone is speaking on walkie-talkie */}
      {walkieTalkieBroadcaster && (
        <div style={{
          width: '100%',
          padding: '6px 12px',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid #f59e0b',
          color: '#fef3c7',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'pulse 1s infinite'
        }}>
          <Volume2 size={16} color="#f59e0b" />
          <span>📻 Incoming Walkie-Talkie voice broadcast from: {walkieTalkieBroadcaster}</span>
        </div>
      )}
    </div>
  );
};
