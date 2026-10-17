export type ClassroomMode = 'grid' | 'spotlight' | 'whiteboard' | 'slides';

export type UserRole = 'instructor' | 'student' | 'speaker' | 'ta';

export interface Participant {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  subtitle?: string;
  avatar: string;
  avatarColor: string;
  isMuted: boolean;
  isCamOff: boolean;
  isHandRaised: boolean;
  isPinned: boolean;
  isTalking: boolean;
  talkSeconds: number;
  engagementScore: number;
  joinTime: string;
  isLocal?: boolean;
  stream?: MediaStream | null;
  audioLevel?: number;
}

export interface ChatMessage {
  id: string;
  channel: 'general' | 'qa' | 'direct';
  author: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
  upvotes?: number;
  isAnswered?: boolean;
  recipientId?: string;
  attachment?: {
    name: string;
    size: number;
    type: string;
    dataUrl: string;
  };
}

export interface SharedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  sender: string;
  dataUrl: string;
  timestamp: string;
}

export interface PollOption {
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedIndex: number | null;
  isActive: boolean;
}

export interface BreakoutRoom {
  id: string;
  name: string;
  members: string[];
  topic: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface AudioDeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
}

export type CallType = 'video' | 'audio';

export interface IncomingCallInfo {
  callerId: string;
  callerName: string;
  callType?: CallType;
}

export type CallState = 'idle' | 'calling' | 'receiving' | 'connected';

export interface RoomPeer {
  peerId: string;
  name: string;
}

export interface OfflineNetworkInfo {
  lanIps: string[];
  port: number;
  urls: string[];
  isOnline: boolean;
  offlineLanMode: boolean; // true = 0kbps internet, LAN host ICE only
}
