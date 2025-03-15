
import { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { FileAudio, FileText, FileVideo, Play } from 'lucide-react';
import { useState } from 'react';

interface MessageMediaProps {
  message: Message;
}

const MessageMedia = ({ message }: MessageMediaProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Format seconds to MM:SS
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle different media types
  switch (message.messageType) {
    case 'image':
      return (
        <div className="mb-1 overflow-hidden">
          {message.textData && <p className="text-sm mb-2">{message.textData}</p>}
          <div className="rounded-lg overflow-hidden max-w-xs bg-gray-100 relative">
            <img
              src={message.filePath}
              alt="Image"
              className={cn(
                "w-full h-auto object-cover transition-all duration-500 blur-in",
                imageLoaded ? "loaded" : ""
              )}
              onLoad={() => setImageLoaded(true)}
            />
            <div className={cn(
              "absolute inset-0 bg-gray-200 flex items-center justify-center transition-opacity duration-500",
              imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            )}>
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      );
      
    case 'video':
      return (
        <div className="mb-1">
          {message.textData && <p className="text-sm mb-2">{message.textData}</p>}
          <div className="rounded-lg overflow-hidden bg-gray-800 max-w-xs relative">
            <div className="w-64 h-40 flex items-center justify-center text-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-10">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
              <div className="absolute bottom-2 right-2 text-xs px-2 py-1 bg-black/50 rounded z-10">
                {formatDuration(message.mediaDuration)}
              </div>
            </div>
          </div>
        </div>
      );
      
    case 'audio':
      return (
        <div className="flex items-center gap-2 text-sm min-w-[180px]">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FileAudio className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium mb-1">Audio message</div>
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>00:00</span>
              <span>{formatDuration(message.mediaDuration)}</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Play className="h-4 w-4 text-primary" />
          </div>
        </div>
      );
      
    case 'document':
      return (
        <div className="flex items-center gap-3 p-2 bg-white/50 rounded-lg border border-gray-200">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <p className="text-sm font-medium truncate">{message.textData || 'Document'}</p>
            <p className="text-xs text-gray-500">
              {message.mimeType?.split('/')[1].toUpperCase() || 'PDF'} 
              {message.pageCount ? ` · ${message.pageCount} pages` : ''}
            </p>
          </div>
        </div>
      );
      
    default:
      return <p className="text-sm">{message.textData || `[${message.messageType} message]`}</p>;
  }
};

export default MessageMedia;
