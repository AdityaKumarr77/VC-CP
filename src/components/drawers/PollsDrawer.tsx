import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { PlusCircle, Check } from 'lucide-react';

export const PollsDrawer: React.FC = () => {
  const { polls, castVote, createPoll } = useClassroom();
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('Superconducting Qubits');
  const [opt2, setOpt2] = useState('Trapped Ion Gates');
  const [opt3, setOpt3] = useState('Photonic Quantum Networks');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const options = [opt1, opt2, opt3].filter(o => o.trim().length > 0);
    createPoll(question.trim(), options);
    setQuestion('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto' }}>
      {/* Create Poll Section */}
      <div className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Launch New Poll</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Poll question..."
            required
            style={{ fontSize: '12px' }}
          />
          <input
            type="text"
            value={opt1}
            onChange={(e) => setOpt1(e.target.value)}
            placeholder="Option 1"
            required
            style={{ fontSize: '12px' }}
          />
          <input
            type="text"
            value={opt2}
            onChange={(e) => setOpt2(e.target.value)}
            placeholder="Option 2"
            required
            style={{ fontSize: '12px' }}
          />
          <input
            type="text"
            value={opt3}
            onChange={(e) => setOpt3(e.target.value)}
            placeholder="Option 3 (Optional)"
            style={{ fontSize: '12px' }}
          />
          <button
            type="submit"
            style={{
              marginTop: '4px',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              gap: '6px'
            }}
          >
            <PlusCircle size={14} />
            Launch to Classroom
          </button>
        </form>
      </div>

      <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)' }} />

      {/* Active Polls List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Active Polls ({polls.length})
        </span>

        {polls.map(poll => (
          <div key={poll.id} className="glass-panel" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                Live Quiz Poll
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                {poll.totalVotes} votes
              </span>
            </div>

            <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>
              {poll.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {poll.options.map((opt, idx) => {
                const percent = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                const isSelected = poll.userVotedIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => castVote(poll.id, idx)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    {/* Animated Progress Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: `${percent}%`,
                        background: 'rgba(6, 182, 212, 0.2)',
                        borderRight: '2px solid var(--accent-cyan)',
                        transition: 'width 0.4s ease',
                        zIndex: 1
                      }}
                    />

                    <span style={{ position: 'relative', zIndex: 2, fontSize: '12px', fontWeight: 500, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {opt.text}
                      {isSelected && <Check size={13} color="var(--accent-cyan)" />}
                    </span>

                    <span style={{ position: 'relative', zIndex: 2, fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                      {percent}% ({opt.votes})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
