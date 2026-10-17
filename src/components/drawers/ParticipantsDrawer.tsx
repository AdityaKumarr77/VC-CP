import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { Mic, MicOff, Video, VideoOff, Hand, VolumeX, ShieldAlert } from 'lucide-react';

export const ParticipantsDrawer: React.FC = () => {
  const { 
    participants, 
    currentUser, 
    muteAll, 
    lowerAllHands, 
    callOnStudent 
  } = useClassroom();

  const [search, setSearch] = useState('');
  const allUsers = [currentUser, ...participants];

  const filtered = allUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.roleLabel.toLowerCase().includes(search.toLowerCase())
  );

  const raisedHands = allUsers.filter(u => u.isHandRaised);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>
      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search people..."
        style={{ width: '100%', fontSize: '12px' }}
      />

      {/* Instructor Controls */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={muteAll}
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            gap: '6px'
          }}
        >
          <VolumeX size={13} />
          Mute All
        </button>

        <button
          onClick={lowerAllHands}
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            gap: '6px'
          }}
        >
          <ShieldAlert size={13} />
          Lower Hands
        </button>
      </div>

      {/* Raised Hands Queue */}
      {raisedHands.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
            Raised Hands ({raisedHands.length})
          </span>
          {raisedHands.map(u => (
            <div
              key={u.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>✋</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{u.name}</span>
              </div>
              <button
                onClick={() => callOnStudent(u.id)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--accent-amber)',
                  color: '#111827',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                Call On
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Roster List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          All Participants ({allUsers.length})
        </span>

        {filtered.map(u => (
          <div
            key={u.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid transparent'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: u.avatarColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                color: '#fff'
              }}>
                {u.avatar}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                  {u.name} {u.id === 'local_user' ? '(You)' : ''}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  {u.subtitle || u.roleLabel}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
              {u.isHandRaised && <Hand size={14} color="var(--accent-amber)" />}
              {u.isMuted ? <MicOff size={14} color="var(--accent-rose)" /> : <Mic size={14} color="var(--accent-cyan)" />}
              {u.isCamOff ? <VideoOff size={14} color="var(--accent-rose)" /> : <Video size={14} color="var(--accent-emerald)" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
