import { useEffect, useRef, useState } from 'react';
import { Conversation, Message } from '@/lib/types';
import { getConversationByUsername, getConversations, sendMessage, setActiveConversation } from '@/services/messageService';
import ConversationList from './ConversationList';
import MessageBubble from './MessageBubble';
import { ChevronLeft, Paperclip, Mic, Send, X, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

const MessageReader = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await getConversations();
        setConversations(data);
        if (!isMobile && data.length > 0 && !activeConversation) {
          handleSelectConversation(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  const handleSelectConversation = async (conversationId: string) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;
      
      setActiveConversation(conversation);
      setMessages(conversation.messages);
      
      setActiveConversation(conversation.id);
      
      setConversations(prevConversations => 
        prevConversations.map(c => ({
          ...c,
          isActive: c.id === conversationId,
          unreadCount: c.id === conversationId ? 0 : c.unreadCount
        }))
      );
      
      if (isMobile) {
        setShowConversations(false);
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;
    
    try {
      const newMessage = await sendMessage(activeConversation.id, messageInput);
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      setConversations(prev => 
        prev.map(c => 
          c.id === activeConversation.id 
            ? { ...c, lastMessage: newMessage } 
            : c
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const formatMessageDate = (timestamp: string) => {
    const messageDate = timestamp.includes('T') 
      ? new Date(timestamp) 
      : new Date(timestamp.replace(' ', 'T') + 'Z');
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM d, yyyy');
    }
  };
  
  const groupedMessages = messages.reduce<{ date: string; messages: Message[] }[]>((groups, message) => {
    const messageDate = formatMessageDate(message.timestamp);
    const existingGroup = groups.find(group => group.date === messageDate);
    
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({ date: messageDate, messages: [message] });
    }
    
    return groups;
  }, []);
  
  const handleBackToConversations = () => {
    setShowConversations(true);
  };
  
  return (
    <div className="flex h-full bg-white overflow-hidden rounded-lg shadow-lg border border-gray-200">
      <div 
        className={cn(
          "w-full md:w-80 border-r border-gray-200 bg-sidebar flex-shrink-0 transition-all duration-300 ease-in-out",
          isMobile && !showConversations && "hidden"
        )}
      >
        <div className="h-16 px-4 border-b border-gray-200 flex items-center">
          <h1 className="text-lg font-semibold">Messages</h1>
        </div>
        <ConversationList 
          conversations={conversations} 
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversation?.id} 
        />
      </div>
      
      <div 
        className={cn(
          "flex-1 flex flex-col h-full transition-all duration-300 ease-in-out",
          isMobile && showConversations && "hidden"
        )}
      >
        {activeConversation ? (
          <>
            <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                {isMobile && (
                  <button 
                    onClick={handleBackToConversations}
                    className="mr-2 p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={activeConversation.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.user.name)}&background=random`} 
                      alt={activeConversation.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-medium">{activeConversation.user.name}</h2>
                    <p className="text-xs text-gray-500">
                      {activeConversation.user.isOnline 
                        ? 'Online' 
                        : `Last seen ${format(new Date(activeConversation.user.lastSeen || ''), 'h:mm a')}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto messages-container relative fade-edge-top fade-edge-bottom bg-[#f5f6f7]">
              {groupedMessages.map((group, groupIndex) => (
                <div key={group.date} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <span className="px-4 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-700">
                      {group.date}
                    </span>
                  </div>
                  {group.messages.map((message, i) => (
                    <MessageBubble 
                      key={message.id} 
                      message={message} 
                    />
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-gray-200 bg-white glass-effect">
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 mx-2">
                  <input
                    type="text"
                    placeholder="Type a message"
                    className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Smile className="h-5 w-5" />
                </button>
                {messageInput.trim() ? (
                  <button 
                    className="p-2 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                ) : (
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                    <Mic className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">Your Messages</h2>
            <p className="text-gray-500 max-w-md">
              {isMobile 
                ? 'Select a conversation to start messaging'
                : loading 
                  ? 'Loading conversations...' 
                  : conversations.length === 0 
                    ? 'No conversations yet' 
                    : 'Select a conversation to start messaging'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReader;
