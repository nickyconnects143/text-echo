
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'contact' | 'location' | 'document' | 'gif' | 'sticker' | 'unknown';

export interface Message {
  id: string;
  fromMe: boolean;
  messageType: MessageType;
  timestamp: string;
  textData?: string;
  starred: boolean;
  chatNumber: string;
  sender: string;
  username: string;
  reaction?: string;
  forwardScore?: number;
  linkIndex?: number;
  filePath?: string;
  mimeType?: string;
  mediaDuration?: number;
  pageCount?: number;
  mentionMsgId?: string;
  subject?: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
  isActive?: boolean;
}
