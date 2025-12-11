'use client';

import { useOnboardingStore, FeelingType } from '@/lib/stores/onboarding-store';
import { feelingOptions } from '@/lib/data/transitions';
import { cn } from '@/lib/utils';

export function StepFeeling() {
  const { feeling, setFeeling } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-drift-400 mb-2">
          Step 2 of 3
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2">
          How are you feeling about this change?
        </h1>
        <p className="text-muted-foreground">
          There's no wrong answer — just where you are today
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
        {feelingOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFeeling(option.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200',
              'hover:scale-105',
              feeling === option.id
                ? 'border-drift-400 bg-drift-400/10 shadow-lg shadow-drift-400/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            )}
          >
            <span className="text-3xl">{option.emoji}</span>
            <span className={cn(
              'text-sm font-medium',
              feeling === option.id ? 'text-drift-400' : 'text-foreground'
            )}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}