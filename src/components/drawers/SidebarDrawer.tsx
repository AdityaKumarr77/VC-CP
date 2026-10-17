import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { ChatDrawer } from './ChatDrawer';
import { ParticipantsDrawer } from './ParticipantsDrawer';
import { PollsDrawer } from './PollsDrawer';
import { BreakoutDrawer } from './BreakoutDrawer';
import { AnalyticsDrawer } from './AnalyticsDrawer';
import { CopilotDrawer } from './CopilotDrawer';
import { X } from 'lucide-react';

export const SidebarDrawer: React.FC = () => {
  const { activeDrawer, setActiveDrawer } = useClassroom();

  if (!activeDrawer) return null;

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'participants', label: 'People' },
    { id: 'polls', label: 'Polls' },
    { id: 'breakout', label: 'Breakout' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'copilot', label: 'AI Copilot' }
  ];

  return (
    <aside style={{
      width: '360px',
      minWidth: '360px',
      height: '100%',
      background: 'var(--bg-glass-heavy)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 25
    }}>
      {/* Top Tab Bar */}
      <nav style={{
        height: '52px',
        minHeight: '52px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0 10px',
        gap: '4px',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveDrawer(tab.id)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: 'var(--radius-xs)',
              fontSize: '11px',
              fontWeight: 600,
              color: activeDrawer === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              background: activeDrawer === tab.id ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}

        <button
          onClick={() => setActiveDrawer(null)}
          style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', color: 'var(--text-muted)' }}
          title="Close Panel"
        >
          <X size={16} />
        </button>
      </nav>

      {/* Drawer Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {activeDrawer === 'chat' && <ChatDrawer />}
        {activeDrawer === 'participants' && <ParticipantsDrawer />}
        {activeDrawer === 'polls' && <PollsDrawer />}
        {activeDrawer === 'breakout' && <BreakoutDrawer />}
        {activeDrawer === 'analytics' && <AnalyticsDrawer />}
        {activeDrawer === 'copilot' && <CopilotDrawer />}
      </div>
    </aside>
  );
};
