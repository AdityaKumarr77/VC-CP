import React, { useState } from 'react';
import { useClassroom } from '../../context/ClassroomContext';
import { Cable, Copy, Check, X, ArrowRight } from 'lucide-react';

export const ManualP2PModal: React.FC = () => {
  const { 
    isManualP2POpen, 
    setIsManualP2POpen, 
    createManualOffer, 
    acceptManualOffer, 
    setManualAnswer, 
    addToast 
  } = useClassroom();

  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [offerText, setOfferText] = useState('');
  const [incomingOfferInput, setIncomingOfferInput] = useState('');
  const [answerOutput, setAnswerOutput] = useState('');
  const [answerInput, setAnswerInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  if (!isManualP2POpen) return null;

  const handleCreateOffer = async () => {
    setIsGenerating(true);
    try {
      const offer = await createManualOffer();
      setOfferText(offer);
      addToast('Generated Air-Gapped WebRTC Offer Code!', 'success');
    } catch (e: any) {
      addToast(`Error generating offer: ${e.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptOffer = async () => {
    if (!incomingOfferInput.trim()) return;
    setIsGenerating(true);
    try {
      const answer = await acceptManualOffer(incomingOfferInput.trim());
      setAnswerOutput(answer);
      addToast('Answer generated! Copy and send it back to Peer 1', 'success');
    } catch (e: any) {
      addToast(`Invalid Offer Code: ${e.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyAnswer = async () => {
    if (!answerInput.trim()) return;
    try {
      await setManualAnswer(answerInput.trim());
      setIsManualP2POpen(false);
      addToast('Air-Gapped connection established! Call is live.', 'success');
    } catch (e: any) {
      addToast(`Error applying answer: ${e.message}`, 'error');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    addToast('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        background: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(155deg, rgba(20, 18, 38, 0.98), rgba(9, 8, 20, 0.98))',
          border: '1.5px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(139, 92, 246, 0.2)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cable size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>
                Air-Gapped P2P WebRTC (Zero Server)
              </h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>
                Connect directly between two machines using pure SDP code exchange
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsManualP2POpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '12px 24px 0', gap: '8px' }}>
          <button
            onClick={() => setTab('create')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              background: tab === 'create' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: tab === 'create' ? '1px solid #8b5cf6' : '1px solid transparent',
              color: tab === 'create' ? '#ddd6fe' : '#94a3b8',
              cursor: 'pointer'
            }}
          >
            1. I am Caller (Peer 1)
          </button>
          <button
            onClick={() => setTab('join')}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              background: tab === 'join' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              border: tab === 'join' ? '1px solid #8b5cf6' : '1px solid transparent',
              color: tab === 'join' ? '#ddd6fe' : '#94a3b8',
              cursor: 'pointer'
            }}
          >
            2. I am Receiver (Peer 2)
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tab === 'create' ? (
            <>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Step 1: Generate Calling Code</span>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 10px' }}>
                  Click below to package your audio, video, and P2P data channels into a self-contained code.
                </p>
                {!offerText ? (
                  <button
                    onClick={handleCreateOffer}
                    disabled={isGenerating}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isGenerating ? 'Packaging Local Streams...' : 'Generate Offer Code'}
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea
                      readOnly
                      value={offerText}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '10px',
                        color: '#c4b5fd',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        resize: 'none'
                      }}
                    />
                    <button
                      onClick={() => handleCopy(offerText, 'offer')}
                      style={{
                        alignSelf: 'flex-start',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'rgba(139, 92, 246, 0.3)',
                        border: '1px solid #8b5cf6',
                        color: '#ddd6fe',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {copied === 'offer' ? <Check size={13} /> : <Copy size={13} />}
                      {copied === 'offer' ? 'Copied Offer Code!' : 'Copy Offer Code to Send to Peer 2'}
                    </button>
                  </div>
                )}
              </div>

              {offerText && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Step 2: Paste Answer Code from Peer 2</span>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 8px' }}>
                    Once Peer 2 pastes your offer on their machine and sends you their answer code, paste it here:
                  </p>
                  <textarea
                    placeholder="Paste Answer Code from Peer 2..."
                    value={answerInput}
                    onChange={e => setAnswerInput(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      resize: 'none'
                    }}
                  />
                  <button
                    onClick={handleApplyAnswer}
                    disabled={!answerInput.trim()}
                    style={{
                      marginTop: '8px',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Connect Air-Gapped Call <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Step 1: Paste Offer Code from Peer 1</span>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 8px' }}>
                  Paste the code generated by Peer 1:
                </p>
                <textarea
                  placeholder="Paste Peer 1 Offer Code here..."
                  value={incomingOfferInput}
                  onChange={e => setIncomingOfferInput(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    resize: 'none'
                  }}
                />
                <button
                  onClick={handleAcceptOffer}
                  disabled={!incomingOfferInput.trim() || isGenerating}
                  style={{
                    marginTop: '8px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isGenerating ? 'Generating Answer...' : 'Accept & Generate Answer Code'}
                </button>
              </div>

              {answerOutput && (
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>Step 2: Copy this Answer Code and send to Peer 1</span>
                  <textarea
                    readOnly
                    value={answerOutput}
                    rows={3}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px 10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '10px',
                      color: '#a7f3d0',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      resize: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleCopy(answerOutput, 'answer')}
                    style={{
                      marginTop: '8px',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.25)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copied === 'answer' ? <Check size={13} /> : <Copy size={13} />}
                    {copied === 'answer' ? 'Copied Answer Code!' : 'Copy Answer Code'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
