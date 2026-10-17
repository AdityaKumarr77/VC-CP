import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { Sparkles, Copy, Check } from 'lucide-react';

export const CopilotDrawer: React.FC = () => {
  const { addToast } = useClassroom();
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const transcript = [
    { speaker: 'Prof. Elena Vance', text: 'Welcome to Advanced Distributed AI. Today we begin our deep dive into quantum neural networks.' },
    { speaker: 'Prof. Elena Vance', text: 'Notice how parameterized quantum circuits allow continuous parameter optimization via gradient descent.' },
    { speaker: 'Alex Rivera', text: 'Does barren plateau affect deep quantum ansatz layers?' },
    { speaker: 'Prof. Elena Vance', text: 'Yes Alex, exactly. That is why local cost functions are preferred over global measurements.' },
    { speaker: 'Prof. Elena Vance', text: 'In Slide 3, we observe how cross-attention projections map embeddings directly into Hilbert spaces.' }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast('AI Lecture Summary generated from real-time audio transcripts!', 'success');
    }, 700);
  };

  const handleCopy = () => {
    const text = `# Lecture Summary: CS-408 Distributed Quantum AI\n\n## Key Concepts\n- Parameterized Quantum Circuits (PQC) gradient descent topologies\n- Localized cost functions resolving barren plateau phenomena\n- Feature embedding projections into multi-modal Hilbert spaces\n\n## Assigned Deliverables\n- Lab 4 Due Friday midnight\n- TA Office Hours tomorrow at 2:00 PM EST`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Markdown notes copied to clipboard!', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>AI Lecture Copilot</h3>
        <span className="badge-live" style={{ fontSize: '10px' }}>Transcribing</span>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        Real-time speech to notes and automated lecture summaries.
      </p>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent-primary)',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          gap: '6px'
        }}
      >
        <Sparkles size={14} />
        {isGenerating ? 'Synthesizing Lecture...' : 'Generate Lecture Summary'}
      </button>

      {/* Summary Output Card */}
      <div className="glass-panel" style={{ padding: '14px', fontSize: '12px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <strong style={{ color: 'var(--accent-cyan)', fontSize: '13px' }}>Key Concepts Covered:</strong>
        <ul style={{ paddingLeft: '16px', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Parameterized Quantum Circuits (PQC) and unitary ansatz depth</li>
          <li>Barren plateau avoidance using localized cost functions</li>
          <li>Cross-attention projection into multi-modal Hilbert spaces</li>
        </ul>

        <strong style={{ color: 'var(--accent-purple)', fontSize: '13px', marginTop: '4px' }}>Assigned Action Items:</strong>
        <ul style={{ paddingLeft: '16px', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Complete Laboratory Exercise 4 (4-qubit classifier ansatz)</li>
          <li>Review Section 3.2 on decoherence mitigation pulses</li>
        </ul>

        <button
          onClick={handleCopy}
          style={{
            marginTop: '8px',
            padding: '6px 10px',
            borderRadius: 'var(--radius-xs)',
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            gap: '6px'
          }}
        >
          {copied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
          {copied ? 'Copied to Clipboard!' : 'Copy Summary Markdown'}
        </button>
      </div>

      {/* Live Transcript Stream */}
      <div>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Live Speech Stream
        </span>
        <div style={{
          marginTop: '6px',
          height: '160px',
          overflowY: 'auto',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: 'var(--radius-xs)',
          padding: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: '#94a3b8',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {transcript.map((t, i) => (
            <p key={i}>
              <strong style={{ color: 'var(--accent-cyan)' }}>{t.speaker}:</strong> {t.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
