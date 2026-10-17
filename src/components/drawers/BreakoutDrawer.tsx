import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { Shuffle, Megaphone, LogIn } from 'lucide-react';

export const BreakoutDrawer: React.FC = () => {
  const { breakoutRooms, shuffleBreakouts, broadcastToBreakouts, addToast } = useClassroom();

  const handleBroadcast = () => {
    const note = prompt('Broadcast notice to all breakout focus rooms:', '5 minutes remaining before returning to the main hall!');
    if (note) broadcastToBreakouts(note);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Breakout Sessions</h3>
        <span className="badge-live" style={{ fontSize: '10px' }}>Timer: 12:40</span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        Partition classroom attendees into small focus discussion groups.
      </p>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={shuffleBreakouts}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-main)',
            gap: '6px'
          }}
        >
          <Shuffle size={13} />
          Shuffle Groups
        </button>

        <button
          onClick={handleBroadcast}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid var(--border-cyan)',
            fontSize: '11px',
            fontWeight: 600,
            color: '#c7d2fe',
            gap: '6px'
          }}
        >
          <Megaphone size={13} />
          Broadcast Note
        </button>
      </div>

      {/* Room Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {breakoutRooms.map(room => (
          <div key={room.id} className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{room.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{room.members.length} members</span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{room.topic}</p>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {room.members.map(m => (
                <span
                  key={m}
                  style={{
                    padding: '3px 8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    color: 'var(--text-muted)'
                  }}
                >
                  {m}
                </span>
              ))}
            </div>

            <button
              onClick={() => addToast(`Joined ${room.name}`, 'info')}
              style={{
                alignSelf: 'flex-start',
                marginTop: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-xs)',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid var(--border-cyan)',
                color: 'var(--accent-cyan)',
                fontSize: '11px',
                fontWeight: 600,
                gap: '4px'
              }}
            >
              <LogIn size={12} />
              Join Room
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
