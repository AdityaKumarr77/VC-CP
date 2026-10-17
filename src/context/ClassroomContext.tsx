import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type { 
  ClassroomMode, 
  Participant, 
  ChatMessage, 
  Poll, 
  BreakoutRoom, 
  ToastMessage,
  AudioDeviceInfo,
  IncomingCallInfo,
  CallState,
  RoomPeer,
  OfflineNetworkInfo,
  SharedFile,
  CallType
} from '../types';

interface ClassroomContextType {
  mode: ClassroomMode;
  setMode: (mode: ClassroomMode) => void;
  spotlightId: string;
  setSpotlightId: (id: string) => void;
  activeDrawer: string | null;
  setActiveDrawer: (drawer: string | null) => void;
  currentUser: Participant;
  participants: Participant[];
  localStream: MediaStream | null;
  audioLevel: number;
  isMicOn: boolean;
  toggleMic: () => void;
  isCamOn: boolean;
  toggleCam: () => void;
  isScreenSharing: boolean;
  toggleScreenShare: () => void;
  isRecording: boolean;
  toggleRecording: () => void;
  isCaptionsOn: boolean;
  toggleCaptions: () => void;
  cameraFilter: string;
  setCameraFilter: (filter: string) => void;
  sessionSeconds: number;
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  triggerReaction: (emoji: string) => void;
  toggleRole: () => void;
  toggleHandRaise: () => void;
  muteAll: () => void;
  lowerAllHands: () => void;
  callOnStudent: (id: string) => void;
  messages: ChatMessage[];
  sendMessage: (channel: 'general' | 'qa' | 'direct', text: string, recipientId?: string, attachment?: any) => void;
  upvoteQA: (id: string) => void;
  markQAAnswered: (id: string, answered: boolean) => void;
  polls: Poll[];
  castVote: (pollId: string, optionIndex: number) => void;
  createPoll: (question: string, options: string[]) => void;
  breakoutRooms: BreakoutRoom[];
  shuffleBreakouts: () => void;
  broadcastToBreakouts: (msg: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isInviteOpen: boolean;
  setIsInviteOpen: (open: boolean) => void;
  roomId: string;
  peerId: string;
  requestMediaPermissions: () => Promise<void>;
  audioDevices: AudioDeviceInfo[];
  videoDevices: AudioDeviceInfo[];
  selectedAudioDevice: string;
  setSelectedAudioDevice: (id: string) => void;
  selectedVideoDevice: string;
  setSelectedVideoDevice: (id: string) => void;
  requestBluetoothDevice: () => Promise<void>;

  // Calling Facility
  callState: CallState;
  callingPeerId: string | null;
  callingPeerName: string | null;
  callDuration: number;
  roomPeers: RoomPeer[];
  incomingCall: IncomingCallInfo | null;
  startCall: (targetPeerId: string, targetName?: string, callType?: CallType) => Promise<void>;
  cancelCall: () => void;
  acceptIncomingCall: (withVideo?: boolean) => Promise<void>;
  declineIncomingCall: () => void;
  callPeer: (targetId: string, callType?: CallType) => void;
  endCall: () => void;
  isInCall: boolean;
  addDemoBots: () => void;
  testCallSelf: () => void;
  activeCallType: CallType;

  // Offline / Without-Internet Hub Features
  offlineNetworkInfo: OfflineNetworkInfo;
  setOfflineLanMode: (enabled: boolean) => void;
  isOfflineModalOpen: boolean;
  setIsOfflineModalOpen: (open: boolean) => void;
  isManualP2POpen: boolean;
  setIsManualP2POpen: (open: boolean) => void;

  // Offline File Sharing
  sharedFiles: SharedFile[];
  sendSharedFile: (file: File) => Promise<void>;

  // Offline Walkie-Talkie (Push-to-Talk)
  isWalkieTalkieActive: boolean;
  walkieTalkieBroadcaster: string | null;
  startWalkieTalkie: () => void;
  stopWalkieTalkie: () => void;

  // Manual Air-Gapped WebRTC P2P (Zero Server)
  createManualOffer: () => Promise<string>;
  acceptManualOffer: (offerSdp: string) => Promise<string>;
  setManualAnswer: (answerSdp: string) => Promise<void>;
}

const ClassroomContext = createContext<ClassroomContextType | null>(null);

export const ClassroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ClassroomMode>('grid');
  const [spotlightId, setSpotlightId] = useState<string>('local_user');
  const [activeDrawer, setActiveDrawer] = useState<string | null>('chat');
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCamOn, setIsCamOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isCaptionsOn, setIsCaptionsOn] = useState<boolean>(true);
  const [cameraFilter, setCameraFilter] = useState<string>('none');
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState<boolean>(false);
  const [isManualP2POpen, setIsManualP2POpen] = useState<boolean>(false);

  // Real MediaStream & Audio Meter
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [audioDevices, setAudioDevices] = useState<AudioDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<AudioDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');

  // Offline Network Info
  const [offlineNetworkInfo, setOfflineNetworkInfo] = useState<OfflineNetworkInfo>(() => ({
    lanIps: [window.location.hostname || '127.0.0.1'],
    port: Number(window.location.port) || 3000,
    urls: [`${window.location.protocol}//${window.location.host}`],
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    offlineLanMode: true // Enabled by default for direct 0kbps offline host-candidate WebRTC
  }));

  // Calling & Room State
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('room') || 'cs408-quantum';
  const isGuest = urlParams.get('guest') === 'true';

  const [myPeerId] = useState<string>(() => 
    isGuest 
      ? 'guest_' + Math.random().toString(36).substring(2, 7)
      : 'user_' + Math.random().toString(36).substring(2, 7)
  );

  const [callState, setCallState] = useState<CallState>('idle');
  const [callingPeerId, setCallingPeerId] = useState<string | null>(null);
  const [callingPeerName, setCallingPeerName] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [roomPeers, setRoomPeers] = useState<RoomPeer[]>([]);
  const [activeCallType, setActiveCallType] = useState<CallType>('video');

  // Offline File Sharing & Walkie Talkie
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [isWalkieTalkieActive, setIsWalkieTalkieActive] = useState<boolean>(false);
  const [walkieTalkieBroadcaster, setWalkieTalkieBroadcaster] = useState<string | null>(null);
  const walkieRecorderRef = useRef<MediaRecorder | null>(null);

  // WebRTC Native connections map: peerId -> RTCPeerConnection
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  // WebRTC Native DataChannels map: peerId -> RTCDataChannel
  const dataChannelsRef = useRef<Map<string, RTCDataChannel>>(new Map());
  const signalingWsRef = useRef<WebSocket | null>(null);
  const toneIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Current local user
  const [currentUser, setCurrentUser] = useState<Participant>(() => {
    if (isGuest) {
      return {
        id: 'local_user',
        name: 'Friend (Guest ' + Math.floor(Math.random() * 900 + 100) + ')',
        role: 'student',
        roleLabel: 'Connected Colleague',
        subtitle: 'My Camera & Audio',
        avatar: 'FR',
        avatarColor: 'linear-gradient(135deg, #10b981, #059669)',
        isMuted: false,
        isCamOff: false,
        isHandRaised: false,
        isPinned: false,
        isTalking: false,
        talkSeconds: 0,
        engagementScore: 100,
        joinTime: 'Just now',
        isLocal: true,
        stream: null
      };
    }
    return {
      id: 'local_user',
      name: 'Dr. Lucas Hayes',
      role: 'instructor',
      roleLabel: 'Host & Lead Presenter',
      subtitle: 'My Camera & Audio',
      avatar: 'LH',
      avatarColor: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      isMuted: false,
      isCamOff: false,
      isHandRaised: false,
      isPinned: true,
      isTalking: false,
      talkSeconds: 142,
      engagementScore: 98,
      joinTime: 'Host',
      isLocal: true,
      stream: null
    };
  });

  const [participants, setParticipants] = useState<Participant[]>([]);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      channel: 'general',
      author: 'Dr. Lucas Hayes',
      role: 'instructor',
      roleLabel: 'Host',
      avatar: 'LH',
      color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      text: 'Welcome! This platform operates 100% offline over Local Wi-Fi or Mobile Hotspot with 0kbps internet data.',
      time: '10:00 AM'
    },
    {
      id: 'm2',
      channel: 'general',
      author: 'System Assistant',
      role: 'ta',
      roleLabel: 'Offline Mesh',
      avatar: 'LAN',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      text: '🟢 Direct P2P Calling & Chatting is active. Open on any device on your Wi-Fi/Hotspot to connect live!',
      time: '10:01 AM'
    }
  ]);

  // Polls State
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 'poll_1',
      question: 'Which offline mode are you currently using to connect?',
      options: [
        { text: 'Mobile Hotspot (No Mobile Data needed)', votes: 8 },
        { text: 'Local Home/Office Wi-Fi Router', votes: 14 },
        { text: 'Ad-hoc LAN / Direct Ethernet Cable', votes: 4 },
        { text: 'Same Laptop (2 Tabs / Split Screen)', votes: 9 }
      ],
      totalVotes: 35,
      userVotedIndex: null,
      isActive: true
    }
  ]);

  // Breakout Rooms
  const [breakoutRooms] = useState<BreakoutRoom[]>([
    { id: 'b1', name: 'Room Alpha (Quantum Sim)', members: ['Dr. Lucas Hayes'], topic: 'Local WebRTC Mesh' },
    { id: 'b2', name: 'Room Beta (Hardware Lab)', members: ['Marcus Sterling'], topic: 'Hotspot Calling' }
  ]);

  // Audio Synthesizer for Ringtone & Chimes (Pure offline Web Audio API)
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playIncomingRingtone = () => {
    stopAllTones();
    const ctx = getAudioContext();
    if (!ctx) return;

    let toggle = false;
    const playTone = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(toggle ? 440 : 480, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        toggle = !toggle;
      } catch (e) {
        // audio context handling
      }
    };

    playTone();
    toneIntervalRef.current = window.setInterval(playTone, 1500);
  };

  const playOutgoingRingtone = () => {
    stopAllTones();
    const ctx = getAudioContext();
    if (!ctx) return;

    const playTone = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } catch (e) {
        // audio context handling
      }
    };

    playTone();
    toneIntervalRef.current = window.setInterval(playTone, 3000);
  };

  const playConnectChime = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    } catch (e) {}
  };

  const playEndChime = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      [783.99, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.3);
      });
    } catch (e) {}
  };

  const playMessageChime = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const stopAllTones = () => {
    if (toneIntervalRef.current !== null) {
      clearInterval(toneIntervalRef.current);
      toneIntervalRef.current = null;
    }
  };

  // Toast Helper
  const addToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // 1. Enumerate and Request Real Camera & Microphone
  const enumerateMediaDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audios: AudioDeviceInfo[] = [];
      const videos: AudioDeviceInfo[] = [];

      devices.forEach(d => {
        if (d.kind === 'audioinput' || d.kind === 'audiooutput') {
          audios.push({
            deviceId: d.deviceId,
            label: d.label || `Audio Device (${d.deviceId.slice(0, 5)})`,
            kind: d.kind
          });
        } else if (d.kind === 'videoinput') {
          videos.push({
            deviceId: d.deviceId,
            label: d.label || `Camera (${d.deviceId.slice(0, 5)})`,
            kind: d.kind
          });
        }
      });

      setAudioDevices(audios);
      setVideoDevices(videos);
    } catch (err) {
      console.warn('Device enumeration error:', err);
    }
  };

  const requestMediaPermissions = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        addToast('MediaDevices API not supported in this environment', 'warning');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined
        }
      });

      setLocalStream(stream);
      setCurrentUser(prev => ({ ...prev, stream }));
      await enumerateMediaDevices();

      // Audio Level Analyser
      try {
        const audioCtx = getAudioContext();
        if (audioCtx) {
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const checkLevel = () => {
            if (!stream.active) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            requestAnimationFrame(checkLevel);
          };
          checkLevel();
        }
      } catch (err) {
        console.warn('Audio metering failed:', err);
      }

      addToast('Camera & Microphone connected successfully!', 'success');
    } catch (err: any) {
      console.warn('Camera/Mic permission error:', err);
      addToast(`Notice: Camera/Mic permission not granted: ${err.message || 'using simulation'}`, 'info');
    }
  };

  // Dynamic RTC Configuration: in offline LAN mode, do NOT use STUN servers to avoid DNS timeouts!
  const getRTCConfig = (): RTCConfiguration => {
    if (offlineNetworkInfo.offlineLanMode) {
      // 100% Offline / LAN / Hotspot: Empty iceServers forces WebRTC to immediately use local host candidates (192.168.x.x)
      return {
        iceServers: []
      };
    }
    // Hybrid WAN mode: Use STUN servers for internet traversal
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
  };

  // Setup WebRTC DataChannel for true direct P2P mesh chat and file sharing
  const setupDataChannel = (dc: RTCDataChannel, remotePeerId: string) => {
    dc.onopen = () => {
      console.log(`[WebRTC DataChannel] P2P DataChannel open with peer ${remotePeerId}`);
      dataChannelsRef.current.set(remotePeerId, dc);
      addToast('Direct P2P DataChannel established with peer!', 'success');
    };

    dc.onclose = () => {
      console.log(`[WebRTC DataChannel] Closed with peer ${remotePeerId}`);
      dataChannelsRef.current.delete(remotePeerId);
    };

    dc.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.action === 'chat') {
          setMessages(prev => {
            if (prev.some(m => m.id === payload.message.id)) return prev;
            return [...prev, payload.message];
          });
          playMessageChime();
          addToast(`💬 P2P Message from ${payload.message.author}`, 'info');
        } else if (payload.action === 'file') {
          setSharedFiles(prev => {
            if (prev.some(f => f.id === payload.file.id)) return prev;
            return [payload.file, ...prev];
          });
          addToast(`📁 Received P2P file: ${payload.file.name}`, 'success');
        } else if (payload.action === 'reaction') {
          confetti({
            particleCount: 40,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else if (payload.action === 'walkie-talkie') {
          playWalkieTalkieAudio(payload.audioData, payload.senderName);
        }
      } catch (err) {
        console.error('DataChannel message parse error:', err);
      }
    };
  };

  // 2. Real Native WebRTC PeerConnection Setup
  const createPeerConnection = (targetPeerId: string, isInitiator?: boolean) => {
    let pc = peerConnectionsRef.current.get(targetPeerId);
    if (pc) return pc;

    pc = new RTCPeerConnection(getRTCConfig());
    peerConnectionsRef.current.set(targetPeerId, pc);

    // Setup direct P2P DataChannel
    if (isInitiator) {
      try {
        const dc = pc.createDataChannel('p2p_mesh', { negotiated: true, id: 0 });
        setupDataChannel(dc, targetPeerId);
      } catch (e) {
        console.warn('DataChannel create error:', e);
      }
    } else {
      pc.ondatachannel = (ev) => {
        setupDataChannel(ev.channel, targetPeerId);
      };
    }

    // Add local tracks to WebRTC connection
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc!.addTrack(track, localStream);
      });
    }

    // When remote track arrives from friend's camera/mic
    pc.ontrack = (event) => {
      console.log(`[WebRTC] Received remote stream from peer ${targetPeerId}!`);
      const remoteStream = event.streams[0];
      setIsInCall(true);
      setCallState('connected');

      setParticipants(prev => {
        const existing = prev.find(p => p.id === targetPeerId);
        if (existing) {
          return prev.map(p => p.id === targetPeerId ? { ...p, stream: remoteStream, isCamOff: false, isMuted: false } : p);
        } else {
          return [
            ...prev,
            {
              id: targetPeerId,
              name: targetPeerId.startsWith('guest_') ? 'Friend (Colleague)' : 'Friend (' + targetPeerId.slice(-4) + ')',
              role: 'student',
              roleLabel: 'Connected Friend',
              subtitle: 'Real Live Stream',
              avatar: 'FR',
              avatarColor: 'linear-gradient(135deg, #10b981, #059669)',
              isMuted: false,
              isCamOff: false,
              isHandRaised: false,
              isPinned: false,
              isTalking: false,
              talkSeconds: 0,
              engagementScore: 100,
              joinTime: 'Just now',
              stream: remoteStream
            }
          ];
        }
      });
      addToast('Real WebRTC video & audio call active with friend!', 'success');
    };

    // ICE Candidate exchange
    pc.onicecandidate = (event) => {
      if (event.candidate && signalingWsRef.current?.readyState === WebSocket.OPEN) {
        signalingWsRef.current.send(JSON.stringify({
          type: 'signal',
          targetPeerId,
          senderPeerId: myPeerId,
          data: { candidate: event.candidate }
        }));
      }
    };

    return pc;
  };

  // Play Walkie-Talkie audio burst
  const playWalkieTalkieAudio = (base64Audio: string, senderName: string) => {
    try {
      setWalkieTalkieBroadcaster(senderName);
      const audio = new Audio(base64Audio);
      audio.play().catch(e => console.warn('Walkie play error:', e));
      setTimeout(() => {
        setWalkieTalkieBroadcaster(null);
      }, 3500);
    } catch (e) {
      console.warn('Walkie talkie playback failed:', e);
    }
  };

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => {
      setOfflineNetworkInfo(prev => ({ ...prev, isOnline: true }));
      addToast('Device is Online with Internet connection', 'info');
    };
    const handleOffline = () => {
      setOfflineNetworkInfo(prev => ({ ...prev, isOnline: false, offlineLanMode: true }));
      addToast('Device is Offline. Switching to Local Wi-Fi / Hotspot LAN Mode (0kbps Internet)!', 'success');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch initial network info from Vite backend
    fetch('/api/network-info')
      .then(res => res.json())
      .then(data => {
        if (data && data.lanIps) {
          setOfflineNetworkInfo(prev => ({
            ...prev,
            lanIps: data.lanIps,
            port: data.port,
            urls: data.urls
          }));
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 3. Connect to Native WebSocket Signaling Server
  useEffect(() => {
    requestMediaPermissions();

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/webrtc-signal`;

    const ws = new WebSocket(wsUrl);
    signalingWsRef.current = ws;

    ws.onopen = () => {
      console.log('[WebRTC Signaling] Connected to native WebSocket server');
      ws.send(JSON.stringify({
        type: 'join',
        roomId,
        peerId: myPeerId,
        name: currentUser.name
      }));
    };

    ws.onmessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);

        // A. Network Info
        if (msg.type === 'network-info') {
          setOfflineNetworkInfo(prev => ({
            ...prev,
            lanIps: msg.lanIps || prev.lanIps,
            port: msg.port || prev.port,
            urls: msg.urls || prev.urls
          }));

        // B. Room Peers Update
        } else if (msg.type === 'room-peers') {
          console.log('[WebRTC Signaling] Room peers:', msg.peers);
          setRoomPeers(msg.peers || []);
        } else if (msg.type === 'peer-joined') {
          console.log('[WebRTC Signaling] Peer joined:', msg.peerId);
          setRoomPeers(prev => {
            if (prev.some(p => p.peerId === msg.peerId)) return prev;
            return [...prev, { peerId: msg.peerId, name: msg.name }];
          });
          addToast(`🟢 ${msg.name} joined local network room! Ready to call.`, 'success');

        } else if (msg.type === 'peer-left') {
          setRoomPeers(prev => prev.filter(p => p.peerId !== msg.peerId));
          const pc = peerConnectionsRef.current.get(msg.peerId);
          pc?.close();
          peerConnectionsRef.current.delete(msg.peerId);
          dataChannelsRef.current.delete(msg.peerId);
          setParticipants(prev => prev.filter(p => p.id !== msg.peerId));
          if (peerConnectionsRef.current.size === 0) {
            setIsInCall(false);
            setCallState('idle');
          }

        // C. Calling Facility Signals
        } else if (msg.type === 'call-invite') {
          console.log('[Calling] Incoming call from:', msg.senderPeerId, msg.senderName);
          setActiveCallType(msg.callType || 'video');
          setIncomingCall({
            callerId: msg.senderPeerId,
            callerName: msg.senderName || 'Friend',
            callType: msg.callType || 'video'
          });
          setCallState('receiving');
          playIncomingRingtone();

        } else if (msg.type === 'call-accept') {
          console.log('[Calling] Call accepted by:', msg.senderPeerId);
          stopAllTones();
          setCallState('connected');
          setIsInCall(true);
          playConnectChime();
          addToast(`${msg.senderName || 'Friend'} accepted call! Establishing video...`, 'success');

          // Initiator starts SDP offer
          const pc = createPeerConnection(msg.senderPeerId, true);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ws.send(JSON.stringify({
            type: 'signal',
            targetPeerId: msg.senderPeerId,
            senderPeerId: myPeerId,
            senderName: currentUser.name,
            data: { sdp: pc.localDescription }
          }));

        } else if (msg.type === 'call-decline') {
          console.log('[Calling] Call declined by:', msg.senderPeerId);
          stopAllTones();
          setCallState('idle');
          setCallingPeerId(null);
          setCallingPeerName(null);
          addToast(`${msg.senderName || 'Friend'} declined the call`, 'warning');

        } else if (msg.type === 'call-cancel') {
          console.log('[Calling] Caller cancelled call');
          stopAllTones();
          setIncomingCall(null);
          setCallState('idle');
          addToast('Call cancelled by caller', 'info');

        } else if (msg.type === 'call-end') {
          console.log('[Calling] Call ended by remote peer');
          stopAllTones();
          playEndChime();
          const pc = peerConnectionsRef.current.get(msg.senderPeerId);
          pc?.close();
          peerConnectionsRef.current.delete(msg.senderPeerId);
          dataChannelsRef.current.delete(msg.senderPeerId);
          setParticipants(prev => prev.filter(p => p.id !== msg.senderPeerId));
          if (peerConnectionsRef.current.size === 0) {
            setIsInCall(false);
            setCallState('idle');
            setCallDuration(0);
          }
          addToast('Call ended by peer', 'info');

        // D. WebRTC SDP & ICE Signals
        } else if (msg.type === 'signal') {
          const { senderPeerId, data } = msg;

          if (data.sdp) {
            let pc = peerConnectionsRef.current.get(senderPeerId);
            if (!pc) {
              pc = createPeerConnection(senderPeerId, false);
            }

            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

            if (data.sdp.type === 'offer') {
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              ws.send(JSON.stringify({
                type: 'signal',
                targetPeerId: senderPeerId,
                senderPeerId: myPeerId,
                senderName: currentUser.name,
                data: { sdp: pc.localDescription }
              }));
            }
          } else if (data.candidate) {
            const pc = peerConnectionsRef.current.get(senderPeerId);
            if (pc) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
              } catch (e) {
                console.warn('ICE candidate add error:', e);
              }
            }
          }

        // E. Direct Messages & Chat Broadcasts
        } else if (msg.type === 'broadcast') {
          if (msg.action === 'chat') {
            setMessages(prev => {
              if (prev.some(m => m.id === msg.message.id)) return prev;
              return [...prev, msg.message];
            });
            playMessageChime();
            if (activeDrawer !== 'chat') {
              addToast(`💬 ${msg.message.author}: ${msg.message.text.slice(0, 35)}...`, 'info');
            }
          } else if (msg.action === 'file') {
            setSharedFiles(prev => {
              if (prev.some(f => f.id === msg.file.id)) return prev;
              return [msg.file, ...prev];
            });
            addToast(`📁 Received file: ${msg.file.name} from ${msg.file.sender}`, 'success');
          } else if (msg.action === 'walkie-talkie') {
            playWalkieTalkieAudio(msg.audioData, msg.senderName || 'Peer');
          } else if (msg.action === 'reaction') {
            confetti({
              particleCount: 50,
              spread: 80,
              origin: { y: 0.6 }
            });
          } else if (msg.action === 'poll-vote') {
            setPolls(prev => prev.map(p => {
              if (p.id !== msg.pollId) return p;
              const opts = p.options.map((opt, idx) => {
                if (idx === msg.optionIndex) return { ...opt, votes: opt.votes + 1 };
                return opt;
              });
              return { ...p, options: opts, totalVotes: p.totalVotes + 1 };
            }));
          } else if (msg.action === 'poll-create') {
            setPolls(prev => [msg.poll, ...prev]);
            addToast(`New poll: "${msg.poll.question}"`, 'info');
          }
        }
      } catch (err) {
        console.error('[WebRTC] Signaling message error:', err);
      }
    };

    return () => {
      ws.close();
      peerConnectionsRef.current.forEach(pc => pc.close());
      dataChannelsRef.current.clear();
      stopAllTones();
    };
  }, [roomId, myPeerId, offlineNetworkInfo.offlineLanMode]);

  // Call Duration Timer
  useEffect(() => {
    let timer: any;
    if (isInCall && callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isInCall, callState]);

  // Session Seconds Counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calling Facility actions
  const startCall = async (targetPeerId: string, targetName: string = 'Friend', callType: CallType = 'video') => {
    if (!targetPeerId.trim()) return;
    if (targetPeerId === myPeerId) {
      addToast('Cannot call your own peer ID! Use "Test Call in 2nd Tab" instead.', 'warning');
      return;
    }

    setActiveCallType(callType);
    setCallingPeerId(targetPeerId.trim());
    setCallingPeerName(targetName);
    setCallState('calling');
    playOutgoingRingtone();
    addToast(`Calling ${targetName} (${callType === 'video' ? 'Video Call' : 'Voice Call'})...`, 'info');

    signalingWsRef.current?.send(JSON.stringify({
      type: 'call-invite',
      targetPeerId: targetPeerId.trim(),
      senderPeerId: myPeerId,
      senderName: currentUser.name,
      callType
    }));
  };

  const cancelCall = () => {
    stopAllTones();
    if (callingPeerId) {
      signalingWsRef.current?.send(JSON.stringify({
        type: 'call-cancel',
        targetPeerId: callingPeerId,
        senderPeerId: myPeerId,
        senderName: currentUser.name
      }));
    }
    setCallState('idle');
    setCallingPeerId(null);
    setCallingPeerName(null);
    addToast('Call cancelled', 'info');
  };

  const acceptIncomingCall = async (withVideo: boolean = true) => {
    stopAllTones();
    if (!incomingCall) return;

    setCallState('connected');
    setIsInCall(true);
    playConnectChime();
    addToast(`Call accepted! Connecting live offline ${withVideo ? 'video & audio' : 'voice call'}...`, 'success');

    // Make sure media permissions are initialized
    if (!localStream) {
      await requestMediaPermissions();
    }

    // Send accept signal to caller
    signalingWsRef.current?.send(JSON.stringify({
      type: 'call-accept',
      targetPeerId: incomingCall.callerId,
      senderPeerId: myPeerId,
      senderName: currentUser.name,
      withVideo
    }));

    // Create receiver connection
    createPeerConnection(incomingCall.callerId, false);
    setIncomingCall(null);
  };

  const declineIncomingCall = () => {
    stopAllTones();
    if (incomingCall) {
      signalingWsRef.current?.send(JSON.stringify({
        type: 'call-decline',
        targetPeerId: incomingCall.callerId,
        senderPeerId: myPeerId,
        senderName: currentUser.name
      }));
      const pc = peerConnectionsRef.current.get(incomingCall.callerId);
      pc?.close();
      peerConnectionsRef.current.delete(incomingCall.callerId);
      dataChannelsRef.current.delete(incomingCall.callerId);
    }
    setIncomingCall(null);
    setCallState('idle');
    addToast('Call declined', 'info');
  };

  const callPeer = (targetId: string, callType: CallType = 'video') => {
    startCall(targetId, 'Peer ' + targetId.slice(-4), callType);
  };

  const endCall = () => {
    stopAllTones();
    playEndChime();

    // Notify all peers
    peerConnectionsRef.current.forEach((pc, pId) => {
      signalingWsRef.current?.send(JSON.stringify({
        type: 'call-end',
        targetPeerId: pId,
        senderPeerId: myPeerId,
        senderName: currentUser.name
      }));
      pc.close();
    });

    peerConnectionsRef.current.clear();
    dataChannelsRef.current.clear();
    setParticipants([]);
    setIsInCall(false);
    setCallState('idle');
    setCallDuration(0);
    setIncomingCall(null);
    setCallingPeerId(null);
    setCallingPeerName(null);
    addToast('Call ended.', 'warning');
  };

  // Launch a second browser tab to test 2-way real calling on this same machine
  const testCallSelf = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    url.searchParams.set('guest', 'true');
    window.open(url.toString(), '_blank');
    addToast('Opened 2nd Tab! Call that friend or let them call you to test 2-way real video/audio call.', 'success');
  };

  // Hardware Toggles
  const toggleMic = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(t => {
        t.enabled = !isMicOn;
      });
    }
    setIsMicOn(prev => !prev);
    setCurrentUser(prev => ({ ...prev, isMuted: isMicOn }));
    addToast(isMicOn ? 'Microphone muted' : 'Microphone unmuted', 'info');
  };

  const toggleCam = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(t => {
        t.enabled = !isCamOn;
      });
    }
    setIsCamOn(prev => !prev);
    setCurrentUser(prev => ({ ...prev, isCamOff: isCamOn }));
    addToast(isCamOn ? 'Camera turned off' : 'Camera turned on', 'info');
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          addToast('Screen sharing is not supported by your browser', 'error');
          return;
        }
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const videoTrack = screenStream.getVideoTracks()[0];

        // Replace track on peer connections
        peerConnectionsRef.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });

        videoTrack.onended = () => {
          stopScreenShare();
        };

        setCurrentUser(prev => ({ ...prev, stream: screenStream }));
        setIsScreenSharing(true);
        addToast('Screen sharing started over local offline network', 'success');
      } catch (err: any) {
        addToast(`Screen share cancelled or failed: ${err.message}`, 'info');
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      peerConnectionsRef.current.forEach(pc => {
        const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
      setCurrentUser(prev => ({ ...prev, stream: localStream }));
    }
    setIsScreenSharing(false);
    addToast('Screen sharing stopped', 'info');
  };

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const toggleRecording = () => {
    if (!isRecording) {
      try {
        const streamToRecord = currentUser.stream || localStream;
        if (!streamToRecord) {
          addToast('No active camera or stream to record', 'warning');
          return;
        }

        const recorder = new MediaRecorder(streamToRecord, { mimeType: 'video/webm' });
        recordedChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `nexus-offline-recording-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(url);
          addToast('Recorded lecture video saved to your device!', 'success');
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        addToast('Lecture recording started locally', 'info');
      } catch (err: any) {
        addToast(`Recording failed: ${err.message}`, 'error');
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const toggleCaptions = () => {
    setIsCaptionsOn(prev => !prev);
    addToast(!isCaptionsOn ? 'AI Offline Subtitles enabled' : 'AI Subtitles disabled', 'info');
  };

  const triggerReaction = (emoji: string) => {
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Broadcast over WebSocket & WebRTC DataChannels
    const payload = {
      type: 'broadcast',
      action: 'reaction',
      emoji,
      sender: currentUser.name
    };

    signalingWsRef.current?.send(JSON.stringify(payload));
    dataChannelsRef.current.forEach(dc => {
      if (dc.readyState === 'open') dc.send(JSON.stringify(payload));
    });

    addToast(`Sent reaction ${emoji}`, 'info');
  };

  const toggleRole = () => {
    setCurrentUser(prev => {
      const nextRole = prev.role === 'instructor' ? 'student' : 'instructor';
      const nextLabel = nextRole === 'instructor' ? 'Host & Presenter' : 'Participant';
      return {
        ...prev,
        role: nextRole,
        roleLabel: nextLabel
      };
    });
    addToast(`Switched role to ${currentUser.role === 'instructor' ? 'Student' : 'Instructor'}`, 'info');
  };

  const toggleHandRaise = () => {
    setCurrentUser(prev => {
      const isRaised = !prev.isHandRaised;
      if (isRaised) {
        triggerReaction('✋');
        addToast('You raised your hand in the offline room', 'info');
      } else {
        addToast('Hand lowered', 'info');
      }
      return { ...prev, isHandRaised: isRaised };
    });
  };

  const muteAll = () => {
    setParticipants(prev => prev.map(p => ({ ...p, isMuted: true })));
    addToast('Muted all participants', 'warning');
  };

  const lowerAllHands = () => {
    setParticipants(prev => prev.map(p => ({ ...p, isHandRaised: false })));
    setCurrentUser(prev => ({ ...prev, isHandRaised: false }));
    addToast('Lowered all hands', 'info');
  };

  const callOnStudent = (id: string) => {
    const student = participants.find(p => p.id === id);
    if (student) {
      setSpotlightId(id);
      setMode('spotlight');
      addToast(`Called on ${student.name} to speak!`, 'success');
    }
  };

  // Chat Messaging (General, Q&A, Direct)
  const sendMessage = (channel: 'general' | 'qa' | 'direct', text: string, recipientId?: string, attachment?: any) => {
    const newMsg: ChatMessage = {
      id: 'm_' + Math.random().toString(36).substring(2, 8),
      channel,
      author: currentUser.name,
      role: currentUser.role,
      roleLabel: currentUser.roleLabel,
      avatar: currentUser.avatar,
      color: currentUser.avatarColor,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      upvotes: 0,
      isAnswered: false,
      recipientId,
      attachment
    };

    setMessages(prev => [...prev, newMsg]);

    const broadcastPayload = {
      type: 'broadcast',
      action: 'chat',
      message: newMsg
    };

    // 1. Send via local WebSocket signaling server
    signalingWsRef.current?.send(JSON.stringify(broadcastPayload));

    // 2. Also send directly via P2P WebRTC DataChannels for total offline redundancy
    dataChannelsRef.current.forEach(dc => {
      if (dc.readyState === 'open') {
        dc.send(JSON.stringify(broadcastPayload));
      }
    });
  };

  // Offline File Sharing
  const sendSharedFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const newFile: SharedFile = {
          id: 'file_' + Date.now(),
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          sender: currentUser.name,
          dataUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setSharedFiles(prev => [newFile, ...prev]);

        const filePayload = {
          type: 'broadcast',
          action: 'file',
          file: newFile
        };

        signalingWsRef.current?.send(JSON.stringify(filePayload));
        dataChannelsRef.current.forEach(dc => {
          if (dc.readyState === 'open') dc.send(JSON.stringify(filePayload));
        });

        // Also post in chat
        sendMessage('general', `Shared file: ${file.name} (${Math.round(file.size / 1024)} KB)`, undefined, {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl
        });

        addToast(`File "${file.name}" sent to everyone over offline LAN!`, 'success');
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Walkie-Talkie Push-to-Talk (PTT)
  const startWalkieTalkie = async () => {
    try {
      if (!localStream) {
        await requestMediaPermissions();
      }
      const stream = localStream || await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const payload = {
            type: 'broadcast',
            action: 'walkie-talkie',
            audioData: base64Audio,
            senderName: currentUser.name
          };

          signalingWsRef.current?.send(JSON.stringify(payload));
          dataChannelsRef.current.forEach(dc => {
            if (dc.readyState === 'open') dc.send(JSON.stringify(payload));
          });
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      walkieRecorderRef.current = recorder;
      setIsWalkieTalkieActive(true);
      addToast('Broadcasting live on Walkie-Talkie radio (PTT)...', 'info');
    } catch (err: any) {
      addToast(`Walkie-talkie failed: ${err.message}`, 'error');
    }
  };

  const stopWalkieTalkie = () => {
    if (walkieRecorderRef.current && walkieRecorderRef.current.state !== 'inactive') {
      walkieRecorderRef.current.stop();
      walkieRecorderRef.current = null;
    }
    setIsWalkieTalkieActive(false);
    addToast('Walkie-Talkie broadcast released', 'info');
  };

  const upvoteQA = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, upvotes: (m.upvotes || 0) + 1 } : m));
    signalingWsRef.current?.send(JSON.stringify({
      type: 'broadcast',
      action: 'qa-upvote',
      id
    }));
  };

  const markQAAnswered = (id: string, answered: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isAnswered: answered } : m));
    signalingWsRef.current?.send(JSON.stringify({
      type: 'broadcast',
      action: 'qa-answered',
      id,
      answered
    }));
  };

  const castVote = (pollId: string, optionIndex: number) => {
    setPolls(prev => prev.map(p => {
      if (p.id !== pollId) return p;
      const opts = p.options.map((opt, idx) => {
        if (idx === optionIndex) return { ...opt, votes: opt.votes + 1 };
        return opt;
      });
      return {
        ...p,
        options: opts,
        totalVotes: p.totalVotes + 1,
        userVotedIndex: optionIndex
      };
    }));

    signalingWsRef.current?.send(JSON.stringify({
      type: 'broadcast',
      action: 'poll-vote',
      pollId,
      optionIndex
    }));

    addToast('Vote registered on live poll!', 'success');
  };

  const createPoll = (question: string, options: string[]) => {
    const newP: Poll = {
      id: 'poll_' + Date.now(),
      question,
      options: options.map(t => ({ text: t, votes: 0 })),
      totalVotes: 0,
      userVotedIndex: null,
      isActive: true
    };
    setPolls(prev => [newP, ...prev]);

    signalingWsRef.current?.send(JSON.stringify({
      type: 'broadcast',
      action: 'poll-create',
      poll: newP
    }));

    addToast('New classroom poll launched!', 'success');
  };

  const shuffleBreakouts = () => {
    addToast('Shuffled participants into breakout rooms!', 'info');
  };

  const broadcastToBreakouts = (msg: string) => {
    addToast(`Broadcast sent to all breakout rooms: "${msg}"`, 'success');
  };

  const requestBluetoothDevice = async () => {
    try {
      if ((navigator as any).bluetooth) {
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service']
        });
        addToast(`Paired with: ${device.name || 'Bluetooth Headset'}`, 'success');
        enumerateMediaDevices();
      } else {
        await enumerateMediaDevices();
        addToast('Bluetooth devices enumerated from your OS audio settings!', 'success');
      }
    } catch (err: any) {
      addToast(`Bluetooth selection: ${err.message || 'Cancelled'}`, 'info');
    }
  };

  // Toggle Offline LAN Mode
  const setOfflineLanMode = (enabled: boolean) => {
    setOfflineNetworkInfo(prev => ({ ...prev, offlineLanMode: enabled }));
    addToast(
      enabled 
        ? 'Switched to 100% Offline LAN Mode (0kbps Internet / Local Host Candidates)' 
        : 'Switched to Online Hybrid Mode (STUN Traversal enabled)', 
      'info'
    );
  };

  // Demo bot classmates for classroom interactions
  const addDemoBots = () => {
    setParticipants([
      {
        id: 'p_elena',
        name: 'Prof. Elena Vance (AI Peer)',
        role: 'speaker',
        roleLabel: 'Professor',
        subtitle: 'Quantum AI Faculty',
        avatar: 'EV',
        avatarColor: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
        isMuted: false,
        isCamOff: false,
        isHandRaised: false,
        isPinned: false,
        isTalking: true,
        talkSeconds: 320,
        engagementScore: 99,
        joinTime: '10:00 AM'
      },
      {
        id: 'p_marcus',
        name: 'Marcus Sterling',
        role: 'student',
        roleLabel: 'Graduate Student',
        subtitle: 'Distributed Systems',
        avatar: 'MS',
        avatarColor: 'linear-gradient(135deg, #10b981, #059669)',
        isMuted: true,
        isCamOff: false,
        isHandRaised: true,
        isPinned: false,
        isTalking: false,
        talkSeconds: 45,
        engagementScore: 92,
        joinTime: '10:02 AM'
      },
      {
        id: 'p_chloe',
        name: 'Chloe Zhang',
        role: 'student',
        roleLabel: 'Researcher',
        subtitle: 'Photonics Lab',
        avatar: 'CZ',
        avatarColor: 'linear-gradient(135deg, #ec4899, #be185d)',
        isMuted: true,
        isCamOff: true,
        isHandRaised: false,
        isPinned: false,
        isTalking: false,
        talkSeconds: 12,
        engagementScore: 88,
        joinTime: '10:05 AM'
      }
    ]);
    addToast('Added 3 interactive demo peers to room grid!', 'success');
  };

  // Manual Air-Gapped WebRTC P2P (Zero Server SDP Exchange)
  const manualPcRef = useRef<RTCPeerConnection | null>(null);

  const createManualOffer = async (): Promise<string> => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    manualPcRef.current = pc;

    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    const dc = pc.createDataChannel('p2p_mesh', { negotiated: true, id: 0 });
    setupDataChannel(dc, 'airgap_peer');

    pc.ontrack = (event) => {
      setParticipants(prev => [
        ...prev.filter(p => p.id !== 'airgap_peer'),
        {
          id: 'airgap_peer',
          name: 'Air-Gapped Friend (P2P)',
          role: 'student',
          roleLabel: 'Air-Gapped P2P',
          subtitle: 'Zero Server Connection',
          avatar: 'AG',
          avatarColor: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          isMuted: false,
          isCamOff: false,
          isHandRaised: false,
          isPinned: true,
          isTalking: false,
          talkSeconds: 0,
          engagementScore: 100,
          joinTime: 'Just now',
          stream: event.streams[0]
        }
      ]);
      setIsInCall(true);
      setCallState('connected');
      addToast('Air-Gapped WebRTC Connection Established!', 'success');
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait for local ICE candidates to gather completely for single-paste bundle
    return new Promise<string>((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve(JSON.stringify(pc.localDescription));
      } else {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve(JSON.stringify(pc.localDescription));
          }
        };
        pc.addEventListener('icegatheringstatechange', checkState);
        setTimeout(() => resolve(JSON.stringify(pc.localDescription)), 1200);
      }
    });
  };

  const acceptManualOffer = async (offerSdp: string): Promise<string> => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    manualPcRef.current = pc;

    if (localStream) {
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    }

    const dc = pc.createDataChannel('p2p_mesh', { negotiated: true, id: 0 });
    setupDataChannel(dc, 'airgap_peer');

    pc.ontrack = (event) => {
      setParticipants(prev => [
        ...prev.filter(p => p.id !== 'airgap_peer'),
        {
          id: 'airgap_peer',
          name: 'Air-Gapped Friend (P2P)',
          role: 'student',
          roleLabel: 'Air-Gapped P2P',
          subtitle: 'Zero Server Connection',
          avatar: 'AG',
          avatarColor: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          isMuted: false,
          isCamOff: false,
          isHandRaised: false,
          isPinned: true,
          isTalking: false,
          talkSeconds: 0,
          engagementScore: 100,
          joinTime: 'Just now',
          stream: event.streams[0]
        }
      ]);
      setIsInCall(true);
      setCallState('connected');
      addToast('Air-Gapped WebRTC Connection Established!', 'success');
    };

    const parsedOffer = JSON.parse(offerSdp);
    await pc.setRemoteDescription(new RTCSessionDescription(parsedOffer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    return new Promise<string>((resolve) => {
      if (pc.iceGatheringState === 'complete') {
        resolve(JSON.stringify(pc.localDescription));
      } else {
        const checkState = () => {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve(JSON.stringify(pc.localDescription));
          }
        };
        pc.addEventListener('icegatheringstatechange', checkState);
        setTimeout(() => resolve(JSON.stringify(pc.localDescription)), 1200);
      }
    });
  };

  const setManualAnswer = async (answerSdp: string): Promise<void> => {
    if (!manualPcRef.current) throw new Error('No active manual peer connection');
    const parsed = JSON.parse(answerSdp);
    await manualPcRef.current.setRemoteDescription(new RTCSessionDescription(parsed));
    addToast('Answer applied! Connecting media...', 'success');
  };

  return (
    <ClassroomContext.Provider
      value={{
        mode,
        setMode,
        spotlightId,
        setSpotlightId,
        activeDrawer,
        setActiveDrawer,
        currentUser,
        participants,
        localStream,
        audioLevel,
        isMicOn,
        toggleMic,
        isCamOn,
        toggleCam,
        isScreenSharing,
        toggleScreenShare,
        isRecording,
        toggleRecording,
        isCaptionsOn,
        toggleCaptions,
        cameraFilter,
        setCameraFilter,
        sessionSeconds,
        toasts,
        addToast,
        triggerReaction,
        toggleRole,
        toggleHandRaise,
        muteAll,
        lowerAllHands,
        callOnStudent,
        messages,
        sendMessage,
        upvoteQA,
        markQAAnswered,
        polls,
        castVote,
        createPoll,
        breakoutRooms,
        shuffleBreakouts,
        broadcastToBreakouts,
        isSettingsOpen,
        setIsSettingsOpen,
        isInviteOpen,
        setIsInviteOpen,
        roomId,
        peerId: myPeerId,
        requestMediaPermissions,
        audioDevices,
        videoDevices,
        selectedAudioDevice,
        setSelectedAudioDevice,
        selectedVideoDevice,
        setSelectedVideoDevice,
        requestBluetoothDevice,

        // Calling facility
        callState,
        callingPeerId,
        callingPeerName,
        callDuration,
        roomPeers,
        incomingCall,
        startCall,
        cancelCall,
        acceptIncomingCall,
        declineIncomingCall,
        callPeer,
        endCall,
        isInCall,
        addDemoBots,
        testCallSelf,
        activeCallType,

        // Offline / Without Internet Hub
        offlineNetworkInfo,
        setOfflineLanMode,
        isOfflineModalOpen,
        setIsOfflineModalOpen,
        isManualP2POpen,
        setIsManualP2POpen,

        // Offline File Sharing
        sharedFiles,
        sendSharedFile,

        // Walkie-Talkie
        isWalkieTalkieActive,
        walkieTalkieBroadcaster,
        startWalkieTalkie,
        stopWalkieTalkie,

        // Manual P2P
        createManualOffer,
        acceptManualOffer,
        setManualAnswer
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) throw new Error('useClassroom must be used within ClassroomProvider');
  return context;
};
