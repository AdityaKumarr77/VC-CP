import React, { useState } from 'react';
import { useClassroom } from '../context/ClassroomContext';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  PenTool, 
  Presentation, 
  Hand, 
  Smile, 
  Subtitles, 
  MessageSquare, 
  Users, 
  BarChart3, 
  Layers, 
  Activity, 
  Sparkles, 
  CircleDot, 
  PhoneOff 
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const {
    isMicOn,
    toggleMic,
    isCamOn,
    toggleCam,
    isScreenSharing,
    toggleScreenShare,
    mode,
    setMode,
    currentUser,
    toggleHandRaise,
    triggerReaction,
    isCaptionsOn,
    toggleCaptions,
    activeDrawer,
    setActiveDrawer,
    isRecording,
    toggleRecording,
    isInCall,
    endCall,
    addToast
  } = useClassroom();

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const { setCameraFilter } = useClassroom();

  const handleLeaveCall = () => {
    if (isInCall) {
      endCall();
    } else {
      if (window.confirm('Are you sure you want to leave the lecture?')) {
        addToast('You have exited the lecture session.', 'warning');
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  };

  const toggleDrawer = (drawerName: string) => {
    if (activeDrawer === drawerName) {
      setActiveDrawer(null);
    } else {
      setActiveDrawer(drawerName);
    }
  };

  return (
    <footer style={{
      height: '76px',
      minHeight: '76px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: 'var(--bg-glass-heavy)',
      backdropFilter: 'blur(24px)',
      borderTop: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 30
    }}>
      {/* Left: AV Hardware Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={toggleMic}
          className={`ctrl-btn ${!isMicOn ? 'off' : ''}`}
          title="Toggle Microphone (M)"
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleCam}
            onContextMenu={(e) => {
              e.preventDefault();
              setIsFilterMenuOpen(!isFilterMenuOpen);
            }}
            className={`ctrl-btn ${!isCamOn ? 'off' : ''}`}
            title="Toggle Camera (V) - Right click for Filters"
          >
            {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {isFilterMenuOpen && (
            <div style={{
              position: 'absolute',
              bottom: '55px',
              left: '0',
              background: 'var(--bg-glass-heavy)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              minWidth: '160px',
              zIndex: 50
            }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                Camera FX
              </span>
              <button
                onClick={() => { setCameraFilter('none'); setIsFilterMenuOpen(false); addToast('Filter: Clear HD'); }}
                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', textAlign: 'left', color: '#fff' }}
              >
                Normal HD
              </button>
              <button
                onClick={() => { setCameraFilter('blur'); setIsFilterMenuOpen(false); addToast('Filter: Background Blur'); }}
                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', textAlign: 'left', color: '#fff' }}
              >
                Background Blur
              </button>
              <button
                onClick={() => { setCameraFilter('studio'); setIsFilterMenuOpen(false); addToast('Filter: Studio Warm Glow'); }}
                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', textAlign: 'left', color: '#fff' }}
              >
                Studio Glow
              </button>
              <button
                onClick={() => { setCameraFilter('cyberpunk'); setIsFilterMenuOpen(false); addToast('Filter: Cyberpunk Neon'); }}
                style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', textAlign: 'left', color: '#fff' }}
              >
                Cyberpunk Neon
              </button>
            </div>
          )}
        </div>

        <button
          onClick={toggleScreenShare}
          className={`ctrl-btn ${isScreenSharing ? 'active' : ''}`}
          title="Share Screen (S)"
        >
          <Monitor size={20} />
        </button>
      </div>

      {/* Center: Stage Tools & Engagement */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '6px 14px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-medium)'
      }}>
        <button
          onClick={() => setMode(mode === 'whiteboard' ? 'grid' : 'whiteboard')}
          className={`ctrl-btn ${mode === 'whiteboard' ? 'active' : ''}`}
          title="Collaborative Whiteboard"
        >
          <PenTool size={18} />
        </button>

        <button
          onClick={() => setMode(mode === 'slides' ? 'grid' : 'slides')}
          className={`ctrl-btn ${mode === 'slides' ? 'active' : ''}`}
          title="Interactive Slide Deck"
        >
          <Presentation size={18} />
        </button>

        <button
          onClick={toggleHandRaise}
          className={`ctrl-btn ${currentUser.isHandRaised ? 'hand-raised' : ''}`}
          title="Raise Hand (H)"
        >
          <Hand size={18} />
        </button>

        {/* Reaction Popover */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="ctrl-btn"
            title="Send Emoji Reaction"
          >
            <Smile size={18} />
          </button>

          {isEmojiPickerOpen && (
            <div style={{
              position: 'absolute',
              bottom: '55px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-glass-heavy)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 10px',
              display: 'flex',
              gap: '8px',
              zIndex: 50
            }}>
              {['👏', '❤️', '💡', '🚀', '🎉', '✋'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => {
                    triggerReaction(emoji);
                    setIsEmojiPickerOpen(false);
                  }}
                  style={{ fontSize: '18px', padding: '4px', cursor: 'pointer', transition: 'transform 0.15s' }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleCaptions}
          className={`ctrl-btn ${isCaptionsOn ? 'active' : ''}`}
          title="Live AI Subtitles"
        >
          <Subtitles size={18} />
        </button>
      </div>

      {/* Right: Drawer Toggles & Meeting State */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => toggleDrawer('chat')}
          className={`ctrl-btn ${activeDrawer === 'chat' ? 'active' : ''}`}
          title="Chat & Q&A"
        >
          <MessageSquare size={18} />
        </button>

        <button
          onClick={() => toggleDrawer('participants')}
          className={`ctrl-btn ${activeDrawer === 'participants' ? 'active' : ''}`}
          title="People & Raised Hands"
        >
          <Users size={18} />
        </button>

        <button
          onClick={() => toggleDrawer('polls')}
          className={`ctrl-btn ${activeDrawer === 'polls' ? 'active' : ''}`}
          title="Live Polls"
        >
          <BarChart3 size={18} />
        </button>

        <button
          onClick={() => toggleDrawer('breakout')}
          className={`ctrl-btn ${activeDrawer === 'breakout' ? 'active' : ''}`}
          title="Breakout Rooms"
        >
          <Layers size={18} />
        </button>

        <button
          onClick={() => toggleDrawer('analytics')}
          className={`ctrl-btn ${activeDrawer === 'analytics' ? 'active' : ''}`}
          title="Classroom Analytics"
        >
          <Activity size={18} />
        </button>

        <button
          onClick={() => toggleDrawer('copilot')}
          className={`ctrl-btn ${activeDrawer === 'copilot' ? 'active' : ''}`}
          title="AI Lecture Copilot"
        >
          <Sparkles size={18} />
        </button>

        <button
          onClick={toggleRecording}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: isRecording ? 'var(--accent-rose)' : 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: isRecording ? '#fff' : '#fda4af',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Record Lecture Video"
        >
          <CircleDot size={14} className={isRecording ? 'animate-pulse' : ''} />
          {isRecording ? 'Stop Rec' : 'Record'}
        </button>

        <button
          onClick={handleLeaveCall}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-rose)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <PhoneOff size={16} />
          {isInCall ? 'End Call' : 'Leave'}
        </button>
      </div>
    </footer>
  );
};
