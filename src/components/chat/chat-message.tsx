import { Sparkles, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  timestamp: string;
  userName?: string | null;
}

export function ChatMessage({ role, content, timestamp, userName }: ChatMessageProps) {
  const isUser = role === 'USER';
  
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-sage-300/20' : 'bg-drift-400/20'
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-sage-300" />
        ) : (
          <Sparkles className="w-4 h-4 text-drift-400" />
        )}
      </div>

      {/* Message bubble */}
      <div className={cn('flex flex-col max-w-[80%]', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-sage-300/20 text-foreground rounded-tr-sm'
              : 'bg-white/5 text-foreground rounded-tl-sm'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {isUser ? userName || 'You' : 'Drift'} · {formattedTime}
        </span>
      </div>
    </div>
  );
}