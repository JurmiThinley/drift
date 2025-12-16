'use client';

import { cn } from '@/lib/utils';

interface MoodHistoryProps {
  checkIns: {
    id: string;
    moodScore: number;
    checkInDate:Date | string;
  }[];
}

const moodColors: Record<number, string> = {
  1: 'bg-red-500/60',
  2: 'bg-orange-500/60',
  3: 'bg-yellow-500/60',
  4: 'bg-lime-500/60',
  5: 'bg-green-500/60',
};

const moodEmojis: Record<number, string> = {
  1: '😔',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😊',
};

export function MoodHistory({ checkIns }: MoodHistoryProps) {
  // Get last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    days.push(date);
  }

  const checkInMap = new Map(
    checkIns.map((c) => {
      const date = new Date(c.checkInDate);
      date.setHours(0, 0, 0, 0);
      return [date.getTime(), c];
    })
  );

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <h2 className="text-lg font-medium text-foreground mb-4">Last 7 Days</h2>
      
      <div className="flex justify-between gap-2">
        {days.map((day) => {
          const checkIn = checkInMap.get(day.getTime());
          const isToday = day.getTime() === new Date().setHours(0, 0, 0, 0);
          
          return (
            <div key={day.getTime()} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {dayLabels[day.getDay()]}
              </span>
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  checkIn ? moodColors[checkIn.moodScore] : 'bg-white/5',
                  isToday && !checkIn && 'ring-2 ring-drift-400/50 ring-dashed'
                )}
              >
                {checkIn ? (
                  <span className="text-lg">{moodEmojis[checkIn.moodScore]}</span>
                ) : (
                  <span className="text-muted-foreground text-xs">—</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {day.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Average mood */}
      {checkIns.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground">
            Average mood: {' '}
            <span className="text-foreground font-medium">
              {(checkIns.reduce((sum, c) => sum + c.moodScore, 0) / checkIns.length).toFixed(1)}
            </span>
            /5
          </p>
        </div>
      )}
    </div>
  );
}