import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-drift-400', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950 flex items-center justify-center">
      <Loading size="lg" text="Loading..." />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 border border-white/10 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/10" />
        <div className="w-5 h-5 rounded bg-white/10" />
      </div>
      <div className="h-5 bg-white/10 rounded w-2/3 mb-2" />
      <div className="h-4 bg-white/10 rounded w-1/2" />
    </div>
  );
}