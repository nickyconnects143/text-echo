
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import MessageMedia from './MessageMedia';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect for staggered appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Format the timestamp
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');
  
  // Define bubble style based on if the message is from the current user
  const bubbleStyle = message.fromMe 
    ? 'bg-message-sent text-message-sent-foreground ml-auto rounded-tr-none justify-end'
    : 'bg-message-received text-message-received-foreground mr-auto rounded-tl-none justify-start';
  
  return (
    <div 
      className={cn(
        'flex flex-col mb-2 max-w-[85%] animate-fade-in',
        message.fromMe ? 'items-end' : 'items-start',
        !isVisible && 'opacity-0'
      )}
    >
      {/* Display sender name for group chats (simplified here) */}
      {!message.fromMe && message.username !== 'You' && (
        <span className="text-xs font-medium text-primary ml-2 mb-1">
          {message.username}
        </span>
      )}
      
      <div 
        className={cn(
          'px-3 py-2 rounded-2xl shadow-sm relative message-bubble-appear',
          bubbleStyle
        )}
      >
        {/* Message content based on type */}
        {message.messageType === 'text' && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.textData}</p>
        )}
        
        {/* Media messages */}
        {(['image', 'video', 'audio', 'document'] as Message['messageType'][]).includes(message.messageType) && (
          <MessageMedia message={message} />
        )}
        
        {/* Message footer - time, status, etc. */}
        <div className="flex items-center justify-end gap-1 mt-1">
          {message.starred && (
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          )}
          <span className="text-xs opacity-70">{formattedTime}</span>
          {message.fromMe && (
            <CheckCheck className="h-3 w-3 text-blue-500" />
          )}
        </div>
        
        {/* Reaction bubble */}
        {message.reaction && (
          <div className="absolute -bottom-3 right-2 bg-white rounded-full px-2 py-0.5 shadow-md text-xs">
            {message.reaction}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
