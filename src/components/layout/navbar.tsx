import Link from 'next/link';
import { LogOut, Home, MessageCircle, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  email?: string | null;
}

export function Navbar({ email }: NavbarProps) {
  return (
    <header className="border-b border-border p-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/dashboard" className="font-display text-2xl text-drift-400">
            drift
          </a>
          
          <nav className="hidden sm:flex items-center gap-1">
            <a 
              href="/dashboard" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </a>
            <a 
              href="/chat" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </a>
            <a 
              href="/roadmap" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Map className="w-4 h-4" />
              Roadmap
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden md:block">
            {email}
          </span>
          <a href="/signout">
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}