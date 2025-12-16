import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { ChatContainer } from '@/components/chat/chat-container';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ChatPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <main className="h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="font-display text-xl text-foreground">Chat with Drift</h1>
            <p className="text-sm text-muted-foreground">Your AI transition companion</p>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-3xl mx-auto">
          <ChatContainer />
        </div>
      </div>
    </main>
  );
}