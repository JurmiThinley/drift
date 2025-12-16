'use client';

import { useState } from 'react';
import { Loader2, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface CheckInWidgetProps {
  initialStreak: number;
  initialCheckedInToday: boolean;
  initialTodayMood?: number;
}

const moodEmojis = [
  { score: 1, emoji: '😔', label: 'Struggling' },
  { score: 2, emoji: '😕', label: 'Difficult' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😊', label: 'Great' },
];

export function CheckInWidget({ 
  initialStreak, 
  initialCheckedInToday,
  initialTodayMood 
}: CheckInWidgetProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(initialTodayMood || null);
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(initialCheckedInToday);
  const [streak, setStreak] = useState(initialStreak);
  const [showReflection, setShowReflection] = useState(false);
  const { toast } = useToast();

  const handleMoodSelect = (score: number) => {
    setSelectedMood(score);
    if (!checkedInToday) {
      setShowReflection(true);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodScore: selectedMood,
          reflection: reflection || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setCheckedInToday(true);
      setStreak(data.streak);
      setShowReflection(false);
      
      toast({
        title: 'Check-in saved! ✨',
        description: data.streak > 1 
          ? `You're on a ${data.streak} day streak!` 
          : 'Great job checking in today!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save check-in',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-foreground">Daily Check-in</h2>
        {streak > 0 && (
          <div className="flex items-center gap-1 text-drift-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </div>
        )}
      </div>

      {/* Mood selector */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-3">
          {checkedInToday ? 'Your mood today:' : 'How are you feeling today?'}
        </p>
        <div className="flex justify-between gap-2">
          {moodEmojis.map((mood) => (
            <button
              key={mood.score}
              onClick={() => handleMoodSelect(mood.score)}
              disabled={isSubmitting}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all',
                'hover:bg-white/10',
                selectedMood === mood.score
                  ? 'bg-drift-400/20 ring-2 ring-drift-400'
                  : 'bg-white/5'
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reflection input */}
      {showReflection && !checkedInToday && (
        <div className="mb-4 animate-fade-up">
          <p className="text-sm text-muted-foreground mb-2">
            Any thoughts to capture? (optional)
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What's on your mind..."
            className={cn(
              'w-full h-24 px-3 py-2 rounded-xl resize-none',
              'bg-white/5 border border-white/10',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-drift-400/50'
            )}
            maxLength={1000}
          />
        </div>
      )}

      {/* Submit button */}
      {!checkedInToday && selectedMood && (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Save Check-in
            </>
          )}
        </Button>
      )}

      {/* Already checked in message */}
      {checkedInToday && (
        <div className="text-center text-sm text-muted-foreground">
          ✓ You've checked in today
        </div>
      )}
    </div>
  );
}