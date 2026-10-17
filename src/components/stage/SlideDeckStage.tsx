import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { ChevronLeft, ChevronRight, Target, BookOpen } from 'lucide-react';

interface Slide {
  category: string;
  title: string;
  bullets: string[];
  diagram: 'circuit' | 'fusion' | 'throughput';
  notes: string;
}

export const SlideDeckStage: React.FC = () => {
  const { addToast } = useClassroom();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [showNotes, setShowNotes] = useState(false);

  const slides: Slide[] = [
    {
      category: 'MODULE 1 • FOUNDATIONS',
      title: 'Distributed Quantum AI & Multi-Modal Systems',
      bullets: [
        'High-performance orchestration of heterogeneous neural and quantum accelerators.',
        'Superposition states |ψ⟩ utilized for exponential state-space evaluation.',
        'Entangled parameter gradient descent with low-overhead decoherence buffers.'
      ],
      diagram: 'circuit',
      notes: 'Remind students that quantum superposition yields exponential state spaces, but measurement collapses the wavefunction, requiring careful readout circuitry.'
    },
    {
      category: 'MODULE 2 • CIRCUIT DESIGN',
      title: 'Parameterized Quantum Circuits (PQC) & Ansatz Depth',
      bullets: [
        'Unitary transformations U(θ) parameterized by continuous classical weights θ.',
        'Barren plateaus avoidance via localized cost function definitions.',
        'Entanglement topologies: All-to-all vs Nearest Neighbor CX coupling lattices.'
      ],
      diagram: 'circuit',
      notes: 'Check that students recall Hadamard gates H and Pauli rotations Rz from last week.'
    },
    {
      category: 'MODULE 3 • ARCHITECTURE',
      title: 'Multi-Modal Feature Fusion Across Vision, Audio & Graph Networks',
      bullets: [
        'Cross-attention mechanisms mapping visual embeddings into quantum Hilbert spaces.',
        'Temporal synchronization of streaming video, telemetry, and speech tokens.',
        'Sub-millisecond inference pipelines with zero-copy shared memory queues.'
      ],
      diagram: 'fusion',
      notes: 'Point to the feature fusion aggregation layer. This connects directly with assignment 3.'
    },
    {
      category: 'MODULE 4 • BENCHMARKS',
      title: 'Distributed Training Scalability & Cluster Throughput',
      bullets: [
        '99.4% linear scaling efficiency across 128 distributed accelerator nodes.',
        'All-Reduce gradient synchronization using NVLink interconnects.',
        'Dynamic load rebalancing mitigating slow quantum measurement readout bottlenecks.'
      ],
      diagram: 'throughput',
      notes: 'Highlight the benchmark bar chart on the slide.'
    },
    {
      category: 'MODULE 5 • SYNTHESIS',
      title: 'Laboratory Project: Quantum Kernel Matrix Formulation',
      bullets: [
        'Lab Exercise 4: Construct a 4-qubit classifier using simulated noisy gates.',
        'Deadline: Friday midnight via the student portal.',
        'Office hours with TA Sarah Chen tomorrow at 2:00 PM EST.'
      ],
      diagram: 'circuit',
      notes: 'Remind class to form pairs for the breakout room discussion exercise.'
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(s => s - 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLaserActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setLaserPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const s = slides[currentSlide];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#06090f',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-medium)',
      position: 'relative'
    }}>
      {/* Viewport Box */}
      <div
        onMouseMove={handleMouseMove}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflow: 'hidden'
        }}
      >
        {/* Laser Dot */}
        {isLaserActive && (
          <div style={{
            position: 'absolute',
            left: `${laserPos.x}px`,
            top: `${laserPos.y}px`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--accent-rose)',
            boxShadow: '0 0 16px var(--accent-rose), 0 0 32px var(--accent-rose)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            zIndex: 40
          }} />
        )}

        {/* Slide Card */}
        <div style={{
          width: '100%',
          maxWidth: '920px',
          aspectRatio: '16 / 9',
          background: 'var(--gradient-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '36px 44px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {s.category}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-subtle)' }}>
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#fff', margin: '14px 0 20px 0', lineHeight: 1.25 }}>
              {s.title}
            </h2>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <ul style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' }}>
                {s.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#e2e8f0', lineHeight: 1.4 }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-cyan)', marginTop: '7px', flexShrink: 0 }} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* Dynamic Diagram Visual */}
              <div style={{ flex: 1, height: '170px', background: '#090e1a', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100%" height="100%" viewBox="0 0 320 160">
                  <line x1="20" y1="40" x2="300" y2="40" stroke="#334155" strokeWidth="2" />
                  <line x1="20" y1="80" x2="300" y2="80" stroke="#334155" strokeWidth="2" />
                  <line x1="20" y1="120" x2="300" y2="120" stroke="#334155" strokeWidth="2" />
                  <rect x="60" y="25" width="34" height="30" rx="4" fill="#6366f1" />
                  <text x="73" y="45" fill="#fff" fontSize="12" fontWeight="bold">H</text>
                  <rect x="130" y="65" width="40" height="30" rx="4" fill="#06b6d4" />
                  <text x="138" y="85" fill="#fff" fontSize="11" fontWeight="bold">Ry(θ)</text>
                  <circle cx="210" cy="40" r="5" fill="#a855f7" />
                  <line x1="210" y1="40" x2="210" y2="80" stroke="#a855f7" strokeWidth="2" />
                  <circle cx="210" cy="80" r="9" fill="none" stroke="#a855f7" strokeWidth="2" />
                  <rect x="250" y="25" width="32" height="30" rx="4" fill="#1e293b" stroke="#38bdf8" />
                  <text x="258" y="44" fill="#38bdf8" fontSize="12">M</text>
                </svg>
              </div>
            </div>
          </div>

          {showNotes && (
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              background: 'rgba(99, 102, 241, 0.12)',
              borderLeft: '3px solid var(--accent-primary)',
              borderRadius: 'var(--radius-xs)',
              fontSize: '12px',
              color: '#c7d2fe'
            }}>
              <strong>Presenter Note:</strong> {s.notes}
            </div>
          )}
        </div>
      </div>

      {/* Slide Navigation Bottom Bar */}
      <div style={{
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'rgba(11, 16, 28, 0.95)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: currentSlide === 0 ? 'var(--text-subtle)' : 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            Slide {currentSlide + 1} of {slides.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: currentSlide === slides.length - 1 ? 'var(--text-subtle)' : 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              setIsLaserActive(!isLaserActive);
              addToast(!isLaserActive ? 'Laser Pointer ON' : 'Laser Pointer OFF', 'info');
            }}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              background: isLaserActive ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: isLaserActive ? '1px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
              color: isLaserActive ? 'var(--accent-rose)' : 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Target size={14} />
            Laser Pointer
          </button>

          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-xs)',
              background: showNotes ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showNotes ? '1px solid var(--border-cyan)' : '1px solid var(--border-subtle)',
              color: showNotes ? '#c7d2fe' : 'var(--text-main)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <BookOpen size={14} />
            Presenter Notes
          </button>
        </div>
      </div>
    </div>
  );
};
