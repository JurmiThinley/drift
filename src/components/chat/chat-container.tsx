'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

interface ChatContainerProps {
  conversationId?: string | null;
  onConversationCreated?: (id: string) => void;
}

export function ChatContainer({ conversationId, onConversationCreated }: ChatContainerProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing conversation or create new one
  useEffect(() => {
    if (conversationId) {
      loadMessages(conversationId);
      setCurrentConversationId(conversationId);
    }
  }, [conversationId]);

  const loadMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const startNewConversation = async () => {
    setIsInitializing(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.conversation) {
        setCurrentConversationId(data.conversation.id);
        setMessages(data.conversation.messages);
        onConversationCreated?.(data.conversation.id);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');

    // If no conversation yet, create one first
    let convId = currentConversationId;
    if (!convId) {
      setIsInitializing(true);
      try {
        const res = await fetch('/api/conversations', { method: 'POST' });
        const data = await res.json();
        convId = data.conversation.id;
        setCurrentConversationId(convId);
        setMessages(data.conversation.messages);
        if (convId) {
            onConversationCreated?.(convId);
          }
      } catch (error) {
        console.error('Failed to create conversation:', error);
        setIsInitializing(false);
        return;
      }
      setIsInitializing(false);
    }

    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: userInput,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userInput }),
      });

      const data = await res.json();

      if (data.userMessage && data.assistantMessage) {
        // Replace temp message with real one and add assistant message
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== tempUserMessage.id),
          data.userMessage,
          data.assistantMessage,
        ]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show start conversation UI if no conversation yet
  if (!currentConversationId && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-drift-400/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-drift-400" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">
            Start a conversation
          </h2>
          <p className="text-muted-foreground mb-6">
            I'm here to support you through your transition. Let's talk about how you're doing.
          </p>
          <Button
            onClick={startNewConversation}
            disabled={isInitializing}
            className="gap-2"
          >
            {isInitializing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Begin chat
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.createdAt}
            userName={session?.user?.name}
          />
        ))}
        
        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-drift-400/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-drift-400" />
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-drift-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-drift-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-drift-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={cn(
              'flex-1 resize-none rounded-xl px-4 py-3',
              'bg-white/5 border border-white/10',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-drift-400/50 focus:border-drift-400',
              'min-h-[48px] max-h-[200px]'
            )}
            rows={1}
            disabled={isLoading || isInitializing}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || isInitializing}
            size="icon"
            className="h-12 w-12 rounded-xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Drift is an AI companion, not a therapist. For crisis support, please contact a professional.
        </p>
      </div>
    </div>
  );
}