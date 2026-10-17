import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useClassroom();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '72px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      {toasts.map(t => {
        let borderColor = 'var(--accent-cyan)';
        let Icon = Info;
        if (t.type === 'success') { borderColor = 'var(--accent-emerald)'; Icon = CheckCircle2; }
        if (t.type === 'warning') { borderColor = 'var(--accent-amber)'; Icon = AlertTriangle; }
        if (t.type === 'error') { borderColor = 'var(--accent-rose)'; Icon = AlertCircle; }

        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 18px',
              background: 'var(--bg-glass-heavy)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--border-medium)',
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-lg)',
              color: '#fff',
              fontSize: '13px',
              animation: 'fadeIn 0.2s ease forwards'
            }}
          >
            <Icon size={16} color={borderColor} />
            <span>{t.text}</span>
          </div>
        );
      })}
    </div>
  );
};
