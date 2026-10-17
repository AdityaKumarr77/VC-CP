import React, { useRef, useState, useEffect } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { 
  PenTool, 
  Highlighter, 
  Square, 
  Circle as CircleIcon, 
  ArrowRight, 
  Type, 
  Eraser, 
  RotateCcw, 
  Trash2, 
  Download 
} from 'lucide-react';

export const WhiteboardStage: React.FC = () => {
  const { addToast } = useClassroom();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'rect' | 'circle' | 'arrow' | 'text' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#38bdf8');
  const [size, setSize] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let prevData: ImageData | null = null;
      if (canvas.width > 0 && canvas.height > 0) {
        prevData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      if (prevData) {
        ctx.putImageData(prevData, 0, 0);
      } else {
        saveHistory();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (historyRef.current.length > 20) historyRef.current.shift();
  };

  const handleUndo = () => {
    if (historyRef.current.length > 1) {
      historyRef.current.pop();
      const last = historyRef.current[historyRef.current.length - 1];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && last) {
        ctx.putImageData(last, 0, 0);
        addToast('Undo performed', 'info');
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveHistory();
    addToast('Whiteboard cleared', 'info');
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `Lecture_Whiteboard_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    addToast('Whiteboard snapshot saved to downloads!', 'success');
  };

  const getCanvasPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasPos(e);
    setIsDrawing(true);
    setStartPos(pos);

    if (tool === 'text') {
      const text = prompt('Enter text annotation for whiteboard:');
      if (text) {
        ctx.fillStyle = color;
        ctx.font = `bold ${size * 4 + 14}px sans-serif`;
        ctx.fillText(text, pos.x, pos.y);
        saveHistory();
      }
      setIsDrawing(false);
      return;
    }

    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasPos(e);

    if (tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color + '55';
      ctx.lineWidth = size * 3;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 4;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      // Shapes: Restore snapshot before drawing preview
      if (snapshot) ctx.putImageData(snapshot, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';

      if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.hypot(pos.x - startPos.x, pos.y - startPos.y);
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (tool === 'arrow') {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        const headlen = 16;
        const angle = Math.atan2(pos.y - startPos.y, pos.x - startPos.x);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headlen * Math.cos(angle - Math.PI / 6), pos.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headlen * Math.cos(angle + Math.PI / 6), pos.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveHistory();
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#0a0f1d',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-medium)',
      display: 'flex'
    }}>
      {/* Floating Toolbar */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        background: 'var(--bg-glass-heavy)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 20
      }}>
        <button
          onClick={() => setTool('pen')}
          className={`ctrl-btn ${tool === 'pen' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Pen"
        >
          <PenTool size={16} />
        </button>

        <button
          onClick={() => setTool('highlighter')}
          className={`ctrl-btn ${tool === 'highlighter' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Highlighter"
        >
          <Highlighter size={16} />
        </button>

        <button
          onClick={() => setTool('rect')}
          className={`ctrl-btn ${tool === 'rect' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Rectangle"
        >
          <Square size={16} />
        </button>

        <button
          onClick={() => setTool('circle')}
          className={`ctrl-btn ${tool === 'circle' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Circle"
        >
          <CircleIcon size={16} />
        </button>

        <button
          onClick={() => setTool('arrow')}
          className={`ctrl-btn ${tool === 'arrow' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Arrow"
        >
          <ArrowRight size={16} />
        </button>

        <button
          onClick={() => setTool('text')}
          className={`ctrl-btn ${tool === 'text' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Text Note"
        >
          <Type size={16} />
        </button>

        <button
          onClick={() => setTool('eraser')}
          className={`ctrl-btn ${tool === 'eraser' ? 'active' : ''}`}
          style={{ width: '36px', height: '36px' }}
          title="Eraser"
        >
          <Eraser size={16} />
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)', margin: '0 4px' }} />

        {/* Color Palette */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#ffffff'].map(c => (
            <span
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: c,
                cursor: 'pointer',
                transform: color === c ? 'scale(1.25)' : 'scale(1)',
                border: color === c ? '2px solid #fff' : '2px solid transparent',
                boxShadow: color === c ? '0 0 8px rgba(255, 255, 255, 0.5)' : 'none',
                transition: 'all 0.15s'
              }}
            />
          ))}
        </div>

        <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)', margin: '0 4px' }} />

        {/* Stroke width */}
        <input
          type="range"
          min="2"
          max="24"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value, 10))}
          style={{ width: '60px', cursor: 'pointer' }}
          title={`Stroke: ${size}px`}
        />

        <div style={{ width: '1px', height: '20px', background: 'var(--border-medium)', margin: '0 4px' }} />

        <button
          onClick={handleUndo}
          className="ctrl-btn"
          style={{ width: '34px', height: '34px' }}
          title="Undo"
        >
          <RotateCcw size={15} />
        </button>

        <button
          onClick={handleClear}
          className="ctrl-btn"
          style={{ width: '34px', height: '34px' }}
          title="Clear Canvas"
        >
          <Trash2 size={15} />
        </button>

        <button
          onClick={handleDownload}
          className="ctrl-btn"
          style={{ width: '34px', height: '34px' }}
          title="Download Snapshot"
        >
          <Download size={15} />
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
};
