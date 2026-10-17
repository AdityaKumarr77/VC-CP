import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { Download } from 'lucide-react';

export const AnalyticsDrawer: React.FC = () => {
  const { participants, currentUser, addToast } = useClassroom();
  const allUsers = [currentUser, ...participants];

  const handleExportCSV = () => {
    let csv = 'Participant Name,Role,Join Time,Engagement Score,Talk Time (Seconds)\n';
    allUsers.forEach(u => {
      csv += `"${u.name}","${u.roleLabel}","${u.joinTime}",${u.engagementScore}%,${u.talkSeconds}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Classroom_Attendance_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Attendance report exported to CSV!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto' }}>
      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Classroom Analytics</h3>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Attendance Rate</span>
          <span className="text-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>
            98.5%
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Engagement Index</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            94 / 100
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hands Raised</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-amber)' }}>
            8 Total
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Poll Turnout</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            100%
          </span>
        </div>
      </div>

      {/* Attendance Header & Export */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
        <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Live Attendance Log
        </h4>
        <button
          onClick={handleExportCSV}
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid var(--border-cyan)',
            color: '#c7d2fe',
            fontSize: '11px',
            fontWeight: 600,
            gap: '4px'
          }}
        >
          <Download size={12} />
          Export CSV
        </button>
      </div>

      {/* Attendance Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-subtle)' }}>
            <th style={{ textAlign: 'left', padding: '6px 8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '6px 8px' }}>Joined</th>
            <th style={{ textAlign: 'left', padding: '6px 8px' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '8px', color: '#fff', fontWeight: 600 }}>{u.name}</td>
              <td style={{ padding: '8px', color: 'var(--text-subtle)' }}>{u.joinTime}</td>
              <td style={{ padding: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{u.engagementScore}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
