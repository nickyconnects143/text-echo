
import { Conversation, Message, MessageType, User } from '@/lib/types';

// Mock users based on the database structure
const users: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    phoneNumber: '+11234567890',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lastSeen: '2023-06-15T14:30:00',
    isOnline: true
  },
  {
    id: '2',
    name: 'David Chen',
    phoneNumber: '+10987654321',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lastSeen: '2023-06-15T12:45:00',
    isOnline: false
  },
  {
    id: '3',
    name: 'Emma Wilson',
    phoneNumber: '+12233445566',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lastSeen: '2023-06-15T13:15:00',
    isOnline: true
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    phoneNumber: '+13344556677',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lastSeen: '2023-06-15T10:30:00',
    isOnline: false
  },
  {
    id: '5',
    name: 'Lisa Taylor',
    phoneNumber: '+14455667788',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
    lastSeen: '2023-06-15T15:20:00',
    isOnline: true
  }
];

// Mock messages generator function
const generateMessages = (userId: string): Message[] => {
  const user = users.find(u => u.id === userId);
  if (!user) return [];

  // Define message types based on your database schema
  const messageTypes: MessageType[] = ['text', 'image', 'audio', 'video', 'contact', 'location', 'document', 'gif', 'sticker', 'unknown'];
  const messageCount = 15 + Math.floor(Math.random() * 15); // Between 15-30 messages
  const messages: Message[] = [];
  
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < messageCount; i++) {
    const isFromMe = Math.random() > 0.5;
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const timestamp = new Date(now.getTime() - Math.random() * oneDay * 3).toISOString();
    
    let textData = '';
    let filePath;
    let mimeType;
    let mediaDuration;
    let pageCount;
    
    if (messageType === 'text') {
      const textOptions = [
        "Hi there! How are you doing today?",
        "Just checking in. What's new?",
        "Can we meet tomorrow for coffee?",
        "Did you see that new movie we talked about?",
        "I'll send you the documents later.",
        "Thanks for your help yesterday!",
        "Let me know when you're free to talk.",
        "Have you finished the project?",
        "Happy birthday! Hope you have a great day.",
        "I'm running a bit late, be there in 10."
      ];
      textData = textOptions[Math.floor(Math.random() * textOptions.length)];
    } else if (messageType === 'image') {
      filePath = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/500/300`;
      mimeType = 'image/jpeg';
      textData = Math.random() > 0.7 ? 'Check out this photo!' : '';
    } else if (messageType === 'audio') {
      filePath = 'audio-file-path';
      mimeType = 'audio/mp3';
      mediaDuration = Math.floor(Math.random() * 120) + 10; // 10-130 seconds
    } else if (messageType === 'video') {
      filePath = 'video-file-path';
      mimeType = 'video/mp4';
      mediaDuration = Math.floor(Math.random() * 300) + 30; // 30-330 seconds
    } else if (messageType === 'document') {
      filePath = 'document-file-path';
      mimeType = 'application/pdf';
      textData = 'Important documents';
      pageCount = Math.floor(Math.random() * 10) + 1; // 1-10 pages
    }
    
    // Create message object that matches your database schema
    messages.push({
      id: `msg-${userId}-${i}`,
      fromMe: isFromMe,
      messageType,
      timestamp,
      textData,
      starred: Math.random() > 0.9, // 10% chance of being starred
      chatNumber: user.phoneNumber,
      sender: isFromMe ? 'You' : user.phoneNumber,
      username: isFromMe ? 'You' : user.name,
      reaction: Math.random() > 0.8 ? ['❤️', '👍', '😂', '😮', '😢', '🙏'][Math.floor(Math.random() * 6)] : undefined,
      forwardScore: Math.random() > 0.9 ? Math.floor(Math.random() * 5) + 1 : undefined,
      linkIndex: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : undefined,
      filePath,
      mimeType,
      mediaDuration,
      pageCount,
      mentionMsgId: Math.random() > 0.9 ? `mention-${Math.floor(Math.random() * 100)}` : undefined,
      subject: Math.random() > 0.9 ? 'Important Message' : undefined
    });
  }
  
  // Sort messages by timestamp
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Generate conversations with messages
const generateConversations = (): Conversation[] => {
  return users.map(user => {
    const messages = generateMessages(user.id);
    return {
      id: user.id,
      user,
      messages,
      lastMessage: messages[messages.length - 1],
      unreadCount: Math.floor(Math.random() * 5),
      isActive: false
    };
  });
};

// Mock conversations
let conversations = generateConversations();

// Simulate API call to get conversations
export const getConversations = async (): Promise<Conversation[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(conversations);
    }, 500);
  });
};

// Simulate API call to get messages for a conversation
export const getMessagesByUsername = async (username: string): Promise<Message[]> => {
  return new Promise(resolve => {
    const conversation = conversations.find(c => c.user.name === username);
    setTimeout(() => {
      resolve(conversation ? conversation.messages : []);
    }, 300);
  });
};

// Simulate API call to get a specific conversation
export const getConversationByUsername = async (username: string): Promise<Conversation | null> => {
  return new Promise(resolve => {
    const conversation = conversations.find(c => c.user.name === username);
    setTimeout(() => {
      resolve(conversation || null);
    }, 300);
  });
};

// Simulate marking a conversation as active
export const setActiveConversation = (conversationId: string): void => {
  conversations = conversations.map(c => ({
    ...c,
    isActive: c.id === conversationId,
    unreadCount: c.id === conversationId ? 0 : c.unreadCount
  }));
};

// Simulate sending a new message
export const sendMessage = async (conversationId: string, text: string): Promise<Message> => {
  return new Promise(resolve => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) throw new Error('Conversation not found');
    
    const newMessage: Message = {
      id: `msg-${conversationId}-${Date.now()}`,
      fromMe: true,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      textData: text,
      starred: false,
      chatNumber: conversation.user.phoneNumber,
      sender: 'You',
      username: 'You'
    };
    
    conversation.messages.push(newMessage);
    conversation.lastMessage = newMessage;
    
    setTimeout(() => {
      resolve(newMessage);
    }, 200);
  });
};
