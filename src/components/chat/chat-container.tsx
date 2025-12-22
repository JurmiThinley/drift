'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Loader2, Sparkles, Plus, MessageCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  startedAt: string;
  messageCount: number;
  messages: { content: string }[];
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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations list and most recent on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await fetch('/api/conversations');
        const data = await res.json();
        
        if (data.conversations) {
          setConversations(data.conversations);
          
          // Load most recent if no specific conversation requested
          if (!conversationId && data.conversations.length > 0) {
            const recent = data.conversations[0];
            setCurrentConversationId(recent.id);
            await loadMessages(recent.id);
          }
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    if (conversationId) {
      loadMessages(conversationId);
      setCurrentConversationId(conversationId);
    } else {
      loadConversations();
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

  const selectConversation = async (convId: string) => {
    setCurrentConversationId(convId);
    await loadMessages(convId);
    setShowHistory(false);
  };

  const startNewConversation = async () => {
    setIsInitializing(true);
    setMessages([]);
    setCurrentConversationId(null);
    
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
      });
      const data = await res.json();
      
      if (data.conversation) {
        setCurrentConversationId(data.conversation.id);
        setMessages(data.conversation.messages);
        setConversations(prev => [data.conversation, ...prev]);
        onConversationCreated?.(data.conversation.id);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setIsInitializing(false);
      setShowHistory(false);
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
        setConversations(prev => [data.conversation, ...prev]);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Show start conversation UI if no conversation yet and no history
  if (!currentConversationId && messages.length === 0 && conversations.length === 0) {
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
    <div className="flex-1 flex h-full">
      {/* History sidebar */}
      <div className={cn(
        'border-r border-white/10 bg-midnight-950/50 flex flex-col transition-all duration-300',
        showHistory ? 'w-72' : 'w-0 overflow-hidden sm:w-16'
      )}>
        {/* Toggle/New chat header */}
        <div className="p-2 border-b border-white/10 flex items-center gap-2">
          {showHistory ? (
            <>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <span className="text-sm font-medium text-foreground flex-1">History</span>
              <button
                onClick={startNewConversation}
                disabled={isInitializing}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="New chat"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </>
          ) : (
            <div className="hidden sm:flex flex-col items-center gap-2 w-full py-2">
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Show history"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </button>
              <button
                onClick={startNewConversation}
                disabled={isInitializing}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="New chat"
              >
                <Plus className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {/* Conversations list */}
        {showHistory && (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={cn(
                  'w-full p-3 text-left hover:bg-white/5 transition-colors border-b border-white/5',
                  currentConversationId === conv.id && 'bg-white/10'
                )}
              >
                <p className="text-sm text-foreground truncate">
                  {conv.messages[0]?.content.substring(0, 30) || 'New conversation'}...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(conv.startedAt)} · {conv.messageCount} messages
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile history toggle */}
        <div className="sm:hidden p-2 border-b border-white/10 flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="text-sm text-muted-foreground flex-1">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={startNewConversation}
            disabled={isInitializing}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

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
    </div>
  );
}