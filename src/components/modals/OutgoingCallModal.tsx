import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { PhoneCall, PhoneOff } from 'lucide-react';

export const OutgoingCallModal: React.FC = () => {
  const { callState, callingPeerId, callingPeerName, cancelCall } = useClassroom();

  if (callState !== 'calling') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      <div
        style={{
          width: '92%',
          maxWidth: '420px',
          background: 'linear-gradient(145deg, #0d1527, #070b14)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '24px',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glowing background aura */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Pulsing Avatar */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.4)',
              animation: 'pulse 1.8s infinite ease-out'
            }}
          />
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <PhoneCall size={38} color="#fff" />
          </div>
        </div>

        {/* Status */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#38bdf8',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}
        >
          Dialing Out • Ringing...
        </span>
        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>
          {callingPeerName || 'Calling Friend'}
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', marginBottom: '32px' }}>
          Peer Target: <code style={{ color: '#38bdf8' }}>{callingPeerId}</code>
        </p>

        {/* Cancel Call Button */}
        <button
          onClick={cancelCall}
          style={{
            padding: '12px 32px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
          }}
        >
          <PhoneOff size={18} color="#fff" />
          <span>Cancel Call</span>
        </button>
      </div>
    </div>
  );
};
