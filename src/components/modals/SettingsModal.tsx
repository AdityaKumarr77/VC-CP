import React from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { X, Mic, Video, Bluetooth, RefreshCw } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    cameraFilter, 
    setCameraFilter, 
    audioLevel,
    audioDevices,
    videoDevices,
    selectedAudioDevice,
    setSelectedAudioDevice,
    selectedVideoDevice,
    setSelectedVideoDevice,
    requestBluetoothDevice,
    requestMediaPermissions,
    addToast 
  } = useClassroom();

  if (!isSettingsOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(4, 7, 14, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '520px',
        background: 'var(--bg-glass-heavy)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            Device & Audio/Video Settings
          </h2>
          <button onClick={() => setIsSettingsOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Bluetooth Quick Pair Action */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid var(--border-cyan)',
            borderRadius: 'var(--radius-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bluetooth size={18} color="var(--accent-cyan)" />
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', display: 'block' }}>
                  Bluetooth Headset & Mic
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Pair or route to AirPods, wireless headphones, or external speakers
                </span>
              </div>
            </div>

            <button
              onClick={requestBluetoothDevice}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--accent-cyan)',
                color: '#070a12',
                fontSize: '11px',
                fontWeight: 700
              }}
            >
              Pair / Scan
            </button>
          </div>

          {/* Microphone Selector & Live Meter */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mic size={14} /> Microphone Input
              </label>
              <button
                onClick={requestMediaPermissions}
                style={{ fontSize: '11px', color: 'var(--accent-cyan)', gap: '4px' }}
              >
                <RefreshCw size={11} /> Refresh Devices
              </button>
            </div>

            <select
              value={selectedAudioDevice}
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {audioDevices.length > 0 ? (
                audioDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                ))
              ) : (
                <option value="">Default System Microphone (Bluetooth / Built-in)</option>
              )}
            </select>

            {/* Live voice test meter */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-subtle)' }}>
                <span>Microphone Volume Level</span>
                <span>{audioLevel}%</span>
              </div>
              <div style={{ height: '8px', background: '#1e293b', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{
                  height: '100%',
                  width: `${audioLevel}%`,
                  background: 'linear-gradient(90deg, var(--accent-emerald), var(--accent-cyan))',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.08s ease'
                }} />
              </div>
            </div>
          </div>

          {/* Camera Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Video size={14} /> Camera Source
            </label>
            <select
              value={selectedVideoDevice}
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {videoDevices.length > 0 ? (
                videoDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label}</option>
                ))
              ) : (
                <option value="">Default HD Webcam</option>
              )}
            </select>
          </div>

          {/* Camera Filter FX */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Camera Filter Effects
            </label>
            <select
              value={cameraFilter}
              onChange={(e) => setCameraFilter(e.target.value)}
              style={{ width: '100%', marginTop: '6px' }}
            >
              <option value="none">Normal HD (Clear Color)</option>
              <option value="blur">Background Blur (Bokeh)</option>
              <option value="studio">Studio Glow (Warm Soft Focus)</option>
              <option value="cyberpunk">Cyberpunk Neon Edge</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <button
            onClick={() => {
              setIsSettingsOpen(false);
              requestMediaPermissions();
              addToast('Audio and camera devices applied!', 'success');
            }}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Apply & Test
          </button>
        </div>
      </div>
    </div>
  );
};
