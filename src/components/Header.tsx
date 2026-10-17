import React from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { 
  GraduationCap, 
  Grid, 
  Tv2, 
  PenTool, 
  Presentation, 
  UserCheck, 
  UserPlus, 
  Settings,
  CircleDot,
  QrCode
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    currentUser,
    toggleRole,
    sessionSeconds,
    isRecording,
    setIsInviteOpen,
    setIsSettingsOpen,
    setIsOfflineModalOpen
  } = useClassroom();

  const formatTimer = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <header style={{
      height: '64px',
      minHeight: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      background: 'var(--bg-glass-heavy)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 30
    }}>
      {/* Brand & Room info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--gradient-nebula)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              NexusClassroom <span className="text-gradient">PRO</span>
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Offline LAN Mesh • Calling & Chatting (0kbps Internet)
            </p>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-medium)' }}></div>

        {/* Offline Network Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            title="Click to view Local Network IP, QR Code, and connect phones/laptops without internet"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 'var(--radius-full)',
              color: '#10b981',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span className="live-pulse-dot" style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            <span>LAN OFFLINE (0 KB/s)</span>
          </button>

          {isRecording && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1px solid var(--accent-rose)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-rose)',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <CircleDot size={12} className="animate-pulse" />
              REC
            </span>
          )}

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
            {formatTimer(sessionSeconds)}
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          gap: '2px'
        }}>
          <button
            onClick={() => setMode('grid')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              color: mode === 'grid' ? '#fff' : 'var(--text-muted)',
              background: mode === 'grid' ? 'var(--accent-primary)' : 'transparent',
              boxShadow: mode === 'grid' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Grid size={14} />
            Gallery Grid
          </button>

          <button
            onClick={() => setMode('spotlight')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              color: mode === 'spotlight' ? '#fff' : 'var(--text-muted)',
              background: mode === 'spotlight' ? 'var(--accent-primary)' : 'transparent',
              boxShadow: mode === 'spotlight' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Tv2 size={14} />
            Lecture Hall
          </button>

          <button
            onClick={() => setMode('whiteboard')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              color: mode === 'whiteboard' ? '#fff' : 'var(--text-muted)',
              background: mode === 'whiteboard' ? 'var(--accent-primary)' : 'transparent',
              boxShadow: mode === 'whiteboard' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <PenTool size={14} />
            Whiteboard
          </button>

          <button
            onClick={() => setMode('slides')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 600,
              color: mode === 'slides' ? '#fff' : 'var(--text-muted)',
              background: mode === 'slides' ? 'var(--accent-primary)' : 'transparent',
              boxShadow: mode === 'slides' ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none'
            }}
          >
            <Presentation size={14} />
            Slide Deck
          </button>
        </nav>
      </div>

      {/* Right Controls: Role & Offline Hub */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            Role:
          </span>
          <button
            onClick={toggleRole}
            style={{
              padding: '4px 10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent-cyan)'
            }}
            title="Click to toggle between Instructor and Student mode"
          >
            <UserCheck size={13} />
            {currentUser.roleLabel}
          </button>
        </div>

        {/* Offline Hub & QR Button */}
        <button
          onClick={() => setIsOfflineModalOpen(true)}
          style={{
            padding: '7px 14px',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 'var(--radius-sm)',
            color: '#38bdf8',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          title="Connect phones & laptops over local Wi-Fi or Hotspot without internet"
        >
          <QrCode size={14} color="#38bdf8" />
          <span>Offline Hub & QR</span>
        </button>

        {/* Invite Button */}
        <button
          onClick={() => setIsInviteOpen(true)}
          style={{
            padding: '7px 14px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 'var(--radius-sm)',
            color: '#c7d2fe',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <UserPlus size={14} />
          Invite
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="ctrl-btn"
          style={{ width: '38px', height: '38px' }}
          title="Audio & Video Settings"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
