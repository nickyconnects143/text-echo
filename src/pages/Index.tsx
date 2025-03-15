
import MessageReader from '@/components/MessageReader';

const Index = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <header className="mb-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            Message Reader
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Modern Messaging Experience</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A beautifully designed messaging interface with support for various message types including text, images, audio, video, and documents.
          </p>
        </header>
        
        <div className="flex-1 w-full">
          <MessageReader />
        </div>
      </div>
    </div>
  );
};

export default Index;
