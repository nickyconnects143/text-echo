
import { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversationId: string) => void;
  activeConversationId?: string;
}

const ConversationList = ({ 
  conversations, 
  onSelectConversation,
  activeConversationId
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter conversations based on search query
  const filteredConversations = searchQuery 
    ? conversations.filter(conv => 
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;
  
  // Format the timestamp for display
  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';
    
    const messageDate = new Date(timestamp);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    return isToday 
      ? format(messageDate, 'h:mm a')
      : format(messageDate, 'MMM d');
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Search bar */}
      <div className="p-3 sticky top-0 z-10 bg-sidebar">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full py-2 pl-10 pr-4 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative fade-edge-bottom">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "flex items-center p-3 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50",
                activeConversationId === conversation.id && "bg-primary/5 hover:bg-primary/10"
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={conversation.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.user.name)}&background=random`} 
                    alt={conversation.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {conversation.user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              {/* Conversation details */}
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 truncate">{conversation.user.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {formatMessageTime(conversation.lastMessage?.timestamp)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage?.textData || 
                     `[${conversation.lastMessage?.messageType || 'No'} message]`}
                  </p>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="ml-2 flex-shrink-0 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
