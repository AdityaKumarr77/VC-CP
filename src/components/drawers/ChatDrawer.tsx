import React, { useState, useRef } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { 
  Send, 
  ThumbsUp, 
  CheckCircle2, 
  Paperclip, 
  Download, 
  FileText, 
  Mic, 
  Radio, 
  FileCheck
} from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    upvoteQA, 
    markQAAnswered, 
    triggerReaction,
    sharedFiles,
    sendSharedFile,
    roomPeers,
    isWalkieTalkieActive,
    startWalkieTalkie,
    stopWalkieTalkie,
    addToast
  } = useClassroom();

  const [subtab, setSubtab] = useState<'general' | 'qa' | 'direct' | 'files'>('general');
  const [inputText, setInputText] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = messages.filter(m => {
    if (subtab === 'general') return m.channel === 'general';
    if (subtab === 'qa') return m.channel === 'qa';
    if (subtab === 'direct') return m.channel === 'direct';
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (subtab === 'direct') {
      sendMessage('direct', inputText.trim(), selectedRecipientId === 'all' ? undefined : selectedRecipientId);
    } else if (subtab === 'qa') {
      sendMessage('qa', inputText.trim());
    } else {
      sendMessage('general', inputText.trim());
    }
    setInputText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      addToast('File too large (Max 25MB for offline LAN transfer)', 'warning');
      return;
    }
    sendSharedFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
      {/* Subchannel Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(15, 23, 42, 0.7)',
        borderRadius: 'var(--radius-sm)',
        padding: '3px',
        border: '1px solid var(--border-subtle)',
        gap: '2px'
      }}>
        <button
          onClick={() => setSubtab('general')}
          style={{
            flex: 1,
            padding: '6px 0',
            fontSize: '11px',
            fontWeight: 600,
            color: subtab === 'general' ? '#fff' : 'var(--text-muted)',
            background: subtab === 'general' ? 'var(--bg-surface)' : 'transparent',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer'
          }}
        >
          Classroom
        </button>

        <button
          onClick={() => setSubtab('direct')}
          style={{
            flex: 1,
            padding: '6px 0',
            fontSize: '11px',
            fontWeight: 600,
            color: subtab === 'direct' ? '#fff' : 'var(--text-muted)',
            background: subtab === 'direct' ? 'var(--bg-surface)' : 'transparent',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer'
          }}
        >
          Direct ({roomPeers.length})
        </button>

        <button
          onClick={() => setSubtab('files')}
          style={{
            flex: 1,
            padding: '6px 0',
            fontSize: '11px',
            fontWeight: 600,
            color: subtab === 'files' ? '#fff' : 'var(--text-muted)',
            background: subtab === 'files' ? 'var(--bg-surface)' : 'transparent',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer'
          }}
        >
          Files ({sharedFiles.length})
        </button>

        <button
          onClick={() => setSubtab('qa')}
          style={{
            flex: 1,
            padding: '6px 0',
            fontSize: '11px',
            fontWeight: 600,
            color: subtab === 'qa' ? '#fff' : 'var(--text-muted)',
            background: subtab === 'qa' ? 'var(--bg-surface)' : 'transparent',
            borderRadius: 'var(--radius-xs)',
            cursor: 'pointer'
          }}
        >
          Q&A
        </button>
      </div>

      {/* Offline Status Tag */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 8px',
        borderRadius: '6px',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        fontSize: '10px',
        color: '#10b981'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Radio size={11} color="#10b981" />
          Offline LAN Mesh • P2P Encrypted (0kbps Data)
        </span>
        <span>{roomPeers.length + 1} connected</span>
      </div>

      {/* Direct Peer Selector if on Direct tab */}
      {subtab === 'direct' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>To:</span>
          <select
            value={selectedRecipientId}
            onChange={e => setSelectedRecipientId(e.target.value)}
            style={{
              flex: 1,
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '11px'
            }}
          >
            <option value="all">Everyone in Room (Broadcast)</option>
            {roomPeers.map(p => (
              <option key={p.peerId} value={p.peerId}>
                {p.name} ({p.peerId})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Files Feed if files tab active */}
      {subtab === 'files' ? (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
          {sharedFiles.length === 0 ? (
            <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
              <FileText size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p>No offline files shared yet.</p>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                Click the 📎 paperclip below to send documents, photos, or lecture notes over local network!
              </p>
            </div>
          ) : (
            sharedFiles.map(file => (
              <div
                key={file.id}
                className="glass-panel"
                style={{
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(14, 165, 233, 0.15)',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FileCheck size={18} color="#38bdf8" />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                      {formatFileSize(file.size)} • {file.sender} • {file.timestamp}
                    </div>
                  </div>
                </div>

                <a
                  href={file.dataUrl}
                  download={file.name}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    flexShrink: 0
                  }}
                >
                  <Download size={12} /> Save
                </a>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Messages Feed */
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
          {filtered.map(msg => (
            subtab === 'qa' ? (
              <div key={msg.id} className="glass-panel" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
                      {msg.avatar}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{msg.author}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>{msg.time}</span>
                </div>

                <p style={{ fontSize: '13px', color: '#f1f5f9', lineHeight: 1.4 }}>{msg.text}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <button
                    onClick={() => upvoteQA(msg.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid var(--border-cyan)',
                      color: '#c7d2fe',
                      fontSize: '11px',
                      fontWeight: 600,
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <ThumbsUp size={12} />
                    Upvote ({msg.upvotes})
                  </button>

                  <button
                    onClick={() => markQAAnswered(msg.id, !msg.isAnswered)}
                    style={{
                      fontSize: '11px',
                      color: msg.isAnswered ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={13} />
                    {msg.isAnswered ? 'Answered' : 'Mark Answered'}
                  </button>
                </div>
              </div>
            ) : (
              <div key={msg.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: msg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {msg.avatar}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{msg.author}</span>
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: 'var(--radius-xs)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: msg.role === 'speaker' || msg.role === 'instructor' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                      color: msg.role === 'speaker' || msg.role === 'instructor' ? '#c7d2fe' : 'var(--text-muted)'
                    }}>
                      {msg.roleLabel}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-subtle)', marginLeft: 'auto' }}>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.4, wordBreak: 'break-word' }}>{msg.text}</p>

                  {/* If message has an attachment */}
                  {msg.attachment && (
                    <div style={{
                      marginTop: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'rgba(14, 165, 233, 0.12)',
                      border: '1px solid rgba(14, 165, 233, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <FileText size={14} color="#38bdf8" />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {msg.attachment.name}
                        </span>
                      </div>
                      <a
                        href={msg.attachment.dataUrl}
                        download={msg.attachment.name}
                        style={{
                          fontSize: '11px',
                          color: '#fff',
                          background: 'rgba(56, 189, 248, 0.25)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: 700
                        }}
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Input Bar & Emojis */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {['👏', '❤️', '💡', '🚀', '🎉', '✋'].map(e => (
              <button
                key={e}
                onClick={() => triggerReaction(e)}
                style={{ fontSize: '16px', padding: '2px 4px', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Quick Walkie-Talkie Button in Chat */}
          <button
            onMouseDown={startWalkieTalkie}
            onMouseUp={stopWalkieTalkie}
            onTouchStart={startWalkieTalkie}
            onTouchEnd={stopWalkieTalkie}
            style={{
              padding: '3px 8px',
              borderRadius: '6px',
              background: isWalkieTalkieActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.15)',
              border: isWalkieTalkieActive ? '1px solid #ef4444' : '1px solid rgba(245, 158, 11, 0.3)',
              color: isWalkieTalkieActive ? '#fca5a5' : '#fbbf24',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Mic size={11} />
            <span>{isWalkieTalkieActive ? 'TALKING...' : 'PTT Radio'}</span>
          </button>
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', gap: '6px' }}>
          {/* File Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file to send over local network without internet"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Paperclip size={14} />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              subtab === 'qa' 
                ? 'Ask a question on Q&A...' 
                : subtab === 'direct' 
                  ? 'Send offline direct message...' 
                  : 'Type a message to offline classroom...'
            }
            style={{ flex: 1, background: 'none', border: 'none', padding: '6px 4px', fontSize: '13px', color: '#fff', outline: 'none' }}
          />

          <button
            type="submit"
            style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-xs)', background: 'var(--accent-primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
