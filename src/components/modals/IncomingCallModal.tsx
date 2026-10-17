import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { Phone, PhoneOff, Video, Mic } from 'lucide-react';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptIncomingCall, declineIncomingCall, callState } = useClassroom();

  if (callState !== 'receiving' || !incomingCall) return null;

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
          maxWidth: '440px',
          background: 'linear-gradient(145deg, #0d1527, #070b14)',
          border: '1.5px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '24px',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.25)',
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
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Pulsing Avatar with Sonar Rings */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              animation: 'pulse 1.8s infinite ease-out'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '-28px',
              borderRadius: '50%',
              border: '1.5px solid rgba(16, 185, 129, 0.2)',
              animation: 'pulse 1.8s infinite ease-out 0.4s'
            }}
          />
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
              zIndex: 2,
              position: 'relative'
            }}
          >
            <Phone size={40} color="#fff" />
          </div>
        </div>

        {/* Caller Info */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#10b981',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}
        >
          Incoming WebRTC Call
        </span>
        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: 0 }}>
          {incomingCall.callerName}
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px', marginBottom: '28px' }}>
          Direct ID: <code style={{ color: '#38bdf8' }}>{incomingCall.callerId}</code>
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', width: '100%', justifyContent: 'center' }}>
          {/* Decline */}
          <button
            onClick={declineIncomingCall}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <PhoneOff size={22} color="#ef4444" />
            <span>Decline</span>
          </button>

          {/* Accept Audio Only */}
          <button
            onClick={() => acceptIncomingCall(false)}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#60a5fa',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <Mic size={22} color="#3b82f6" />
            <span>Voice Only</span>
          </button>

          {/* Accept Video Call */}
          <button
            onClick={() => acceptIncomingCall(true)}
            style={{
              flex: 1.2,
              padding: '14px 16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
            }}
          >
            <Video size={22} color="#fff" />
            <span>Answer Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
