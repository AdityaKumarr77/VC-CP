import React from 'react';
import { ClassroomProvider, useClassroom } from './context/ClassroomContext';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { GalleryGrid } from './components/stage/GalleryGrid';
import { SpotlightStage } from './components/stage/SpotlightStage';
import { WhiteboardStage } from './components/stage/WhiteboardStage';
import { SlideDeckStage } from './components/stage/SlideDeckStage';
import { SidebarDrawer } from './components/drawers/SidebarDrawer';
import { SettingsModal } from './components/modals/SettingsModal';
import { InviteModal } from './components/modals/InviteModal';
import { IncomingCallModal } from './components/modals/IncomingCallModal';
import { OutgoingCallModal } from './components/modals/OutgoingCallModal';
import { OfflineConnectModal } from './components/modals/OfflineConnectModal';
import { ManualP2PModal } from './components/modals/ManualP2PModal';
import { ToastContainer } from './components/ui/ToastContainer';
import { MessageSquareText } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { mode, isCaptionsOn } = useClassroom();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', position: 'relative' }}>
      <Header />

      {/* Main Workspace Frame */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          padding: '16px',
          background: 'radial-gradient(circle at center 40%, rgba(15, 23, 42, 0.6) 0%, rgba(7, 10, 18, 0.96) 100%)'
        }}>
          {mode === 'grid' && <GalleryGrid />}
          {mode === 'spotlight' && <SpotlightStage />}
          {mode === 'whiteboard' && <WhiteboardStage />}
          {mode === 'slides' && <SlideDeckStage />}

          {/* Live AI Subtitles Bar */}
          {isCaptionsOn && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 18px',
              maxWidth: '75%',
              background: 'rgba(11, 16, 28, 0.94)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-cyan)',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              zIndex: 20
            }}>
              <MessageSquareText size={16} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                Prof. Elena Vance:
              </span>
              <span style={{ fontSize: '13px', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Today we are synthesizing continuous parameters in quantum neural network ansatz depth...
              </span>
            </div>
          )}
        </main>

        <SidebarDrawer />
      </div>

      <Toolbar />
      <SettingsModal />
      <InviteModal />
      <IncomingCallModal />
      <OutgoingCallModal />
      <OfflineConnectModal />
      <ManualP2PModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <ClassroomProvider>
      <MainLayout />
    </ClassroomProvider>
  );
}

export default App;
