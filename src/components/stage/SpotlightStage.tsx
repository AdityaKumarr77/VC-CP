import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { VideoTile } from './VideoTile';

export const SpotlightStage: React.FC = () => {
  const { currentUser, participants, spotlightId, setSpotlightId } = useClassroom();
  const allUsers = [currentUser, ...participants];

  const spotlightUser = allUsers.find(u => u.id === spotlightId) || participants[0];
  const filmstripUsers = allUsers.filter(u => u.id !== spotlightUser.id);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      overflow: 'hidden'
    }}>
      {/* Main Spotlight Theater */}
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <VideoTile participant={spotlightUser} isSpotlight={true} />
      </div>

      {/* Horizontal Filmstrip */}
      <div style={{
        height: '130px',
        minHeight: '130px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        overflowX: 'auto',
        padding: '4px 2px'
      }}>
        {filmstripUsers.map(u => (
          <div
            key={u.id}
            onClick={() => setSpotlightId(u.id)}
            style={{
              width: '190px',
              minWidth: '190px',
              height: '100%',
              cursor: 'pointer',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              transition: 'transform 0.2s ease'
            }}
            title="Click to spotlight this participant"
          >
            <VideoTile participant={u} />
          </div>
        ))}
      </div>
    </div>
  );
};
