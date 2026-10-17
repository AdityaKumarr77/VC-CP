import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { X, Copy, Check, Users, QrCode, Radio } from 'lucide-react';

export const InviteModal: React.FC = () => {
  const { 
    isInviteOpen, 
    setIsInviteOpen, 
    roomId, 
    addToast,
    setIsOfflineModalOpen 
  } = useClassroom();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isInviteOpen) return null;

  // Form direct room URL
  const roomUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    addToast('Direct conference call link copied to clipboard!', 'success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    addToast('Room code copied!', 'info');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 14, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '520px',
        background: 'var(--bg-glass-heavy)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--accent-cyan)" />
            Invite Friends & Connect Live
          </h2>
          <button onClick={() => setIsInviteOpen(false)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Offline Highlight Box */}
          <div style={{
            padding: '12px 14px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12px',
            color: '#c7d2fe',
            lineHeight: 1.5,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <strong style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} color="#10b981" /> 100% Offline Calling & Chatting Active:
            </strong>
            <span>
              You do <strong>not need any internet connection</strong>! Devices on the same Wi-Fi router or Mobile Hotspot can scan a QR code to join your classroom and call instantly at 0kbps data cost.
            </span>
            <button
              onClick={() => {
                setIsInviteOpen(false);
                setIsOfflineModalOpen(true);
              }}
              style={{
                alignSelf: 'flex-start',
                marginTop: '4px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <QrCode size={13} /> View QR Code & Offline LAN Addresses
            </button>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Direct Room Calling Link
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="text"
                value={roomUrl}
                readOnly
                style={{ flex: 1, fontSize: '12px', fontFamily: 'var(--font-mono)' }}
              />
              <button
                onClick={handleCopyLink}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Room Code & Encryption Passcode
            </label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                <input type="text" value={roomId} readOnly style={{ flex: 1, fontSize: '12px', fontFamily: 'var(--font-mono)' }} />
                <button
                  onClick={handleCopyCode}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
              <input type="text" value="NX-QUANTUM-2026" readOnly style={{ flex: 1, fontSize: '12px', fontFamily: 'var(--font-mono)' }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '14px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={() => setIsInviteOpen(false)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
