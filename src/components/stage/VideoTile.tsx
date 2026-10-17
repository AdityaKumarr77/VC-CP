import React, { useEffect, useRef } from 'react';
import type { Participant } from '../../types';
import { useClassroom } from '../../context/ClassroomContext';
import { Pin, Maximize2, MicOff, Camera, Video } from 'lucide-react';

interface VideoTileProps {
  participant: Participant;
  isSpotlight?: boolean;
}

export const VideoTile: React.FC<VideoTileProps> = ({ participant, isSpotlight = false }) => {
  const { 
    setSpotlightId, 
    setMode, 
    localStream, 
    audioLevel, 
    cameraFilter,
    requestMediaPermissions 
  } = useClassroom();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Bind real MediaStream if available (Local user or connected friend)
  const activeStream = participant.isLocal ? localStream : participant.stream;

  useEffect(() => {
    if (videoRef.current && activeStream) {
      videoRef.current.srcObject = activeStream;
      videoRef.current.play().catch(() => {});
    }
  }, [activeStream, participant.isCamOff]);

  // If no real stream (AI classmate), render dynamic procedural canvas
  useEffect(() => {
    if (activeStream) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = Math.random() * 50;

    const render = () => {
      t += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0a0e1a');
      grad.addColorStop(0.5, '#131b2e');
      grad.addColorStop(1, '#080c14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Backlight glow
      const glowGrad = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.45,
        10,
        canvas.width * 0.5,
        canvas.height * 0.45,
        220
      );
      if (participant.id === 'p_elena') glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      else if (participant.id === 'p_sarah') glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
      else glowGrad.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Avatar Silhouette
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 + 35);

      const breath = Math.sin(t * 1.5) * 2;
      const talkShift = participant.isTalking ? Math.sin(t * 8) * 3 : 0;

      // Suit
      ctx.beginPath();
      ctx.ellipse(0, 85 + breath, 115, 65, 0, Math.PI, 0);
      ctx.fillStyle = participant.id === 'p_elena' ? '#1e293b' : '#1e1b4b';
      ctx.fill();

      // Collar
      ctx.beginPath();
      ctx.moveTo(-20, 20 + breath);
      ctx.lineTo(0, 40 + breath);
      ctx.lineTo(20, 20 + breath);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Head
      ctx.beginPath();
      ctx.arc(0, -12 + breath + talkShift, 45, 0, Math.PI * 2);
      ctx.fillStyle = '#334155';
      ctx.fill();

      // Hair
      ctx.beginPath();
      ctx.arc(0, -22 + breath + talkShift, 47, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      if (participant.id === 'p_elena') {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(-28, -20 + breath + talkShift, 22, 10);
        ctx.fillRect(6, -20 + breath + talkShift, 22, 10);
        ctx.strokeStyle = '#0284c7';
        ctx.strokeRect(-28, -20 + breath + talkShift, 22, 10);
        ctx.strokeRect(6, -20 + breath + talkShift, 22, 10);
      }

      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px monospace';
      ctx.fillText('AI CLASSROOM PEER • 1080p', 16, 24);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeStream, participant.isTalking, participant.id]);

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpotlightId(participant.id);
    setMode('spotlight');
  };

  const isSpeaking = participant.isLocal 
    ? audioLevel > 12 && !participant.isMuted
    : participant.isTalking && !participant.isMuted;

  // Filter styles
  let filterCss = 'none';
  if (participant.isLocal) {
    if (cameraFilter === 'blur') filterCss = 'blur(2px) contrast(1.1)';
    if (cameraFilter === 'studio') filterCss = 'brightness(1.1) saturate(1.2)';
    if (cameraFilter === 'cyberpunk') filterCss = 'hue-rotate(180deg) saturate(1.5)';
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: isSpotlight ? '340px' : '200px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-secondary)',
        border: isSpeaking ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
        boxShadow: isSpeaking
          ? '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.15)'
          : 'var(--shadow-md)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.25s ease'
      }}
    >
      {/* 1. Real Video Element if stream exists */}
      {activeStream && !participant.isCamOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isLocal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: participant.isLocal ? 'scaleX(-1)' : 'none',
            filter: filterCss
          }}
        />
      ) : activeStream && participant.isCamOff ? (
        // Camera turned off view
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          zIndex: 2
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: participant.avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 700,
            color: '#fff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}>
            {participant.avatar}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Camera Off</span>
        </div>
      ) : participant.isLocal && !localStream ? (
        // Local user needs to grant camera permission
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          padding: '24px',
          textAlign: 'center',
          zIndex: 5
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Camera size={26} color="var(--accent-primary)" />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Enable Camera & Mic</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Allow permissions so your friends can see and hear you live!
            </p>
          </div>
          <button
            onClick={requestMediaPermissions}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              gap: '6px',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}
          >
            <Video size={14} />
            Turn On Camera & Mic
          </button>
        </div>
      ) : (
        // AI classmate simulated canvas
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* Hand Raised Badge */}
      {participant.isHandRaised && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'rgba(245, 158, 11, 0.95)',
          color: '#111827',
          fontSize: '11px',
          fontWeight: 700,
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
          zIndex: 10
        }}>
          ✋ Hand Raised
        </div>
      )}

      {/* Top Action Overlay */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 10
      }}>
        <button
          onClick={handlePin}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-muted)'
          }}
          title="Spotlight this participant"
        >
          <Pin size={13} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const el = e.currentTarget.parentElement?.parentElement;
            if (el && el.requestFullscreen) el.requestFullscreen();
          }}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-muted)'
          }}
          title="Fullscreen"
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Bottom Info Pill */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          background: 'rgba(11, 16, 28, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          pointerEvents: 'auto'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
            {participant.name} {participant.isLocal ? '(You)' : ''}
          </span>
          <span style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: 'var(--radius-xs)',
            fontWeight: 700,
            textTransform: 'uppercase',
            background: participant.isLocal ? 'rgba(6, 182, 212, 0.25)' : 'rgba(99, 102, 241, 0.25)',
            color: participant.isLocal ? 'var(--accent-cyan)' : '#c7d2fe'
          }}>
            {participant.roleLabel}
          </span>

          <div className={`audio-wave-meter ${isSpeaking ? 'active' : ''}`}>
            <div className="wave-bar" style={{ height: participant.isLocal ? `${Math.max(4, audioLevel * 0.14)}px` : undefined }}></div>
            <div className="wave-bar" style={{ height: participant.isLocal ? `${Math.max(4, audioLevel * 0.16)}px` : undefined }}></div>
            <div className="wave-bar" style={{ height: participant.isLocal ? `${Math.max(4, audioLevel * 0.12)}px` : undefined }}></div>
            <div className="wave-bar" style={{ height: participant.isLocal ? `${Math.max(4, audioLevel * 0.15)}px` : undefined }}></div>
          </div>

          {participant.isMuted && (
            <MicOff size={13} color="var(--accent-rose)" />
          )}
        </div>
      </div>
    </div>
  );
};
