'use client';

import { useOnboardingStore, TransitionType } from '@/lib/stores/onboarding-store';
import { transitionOptions } from '@/lib/data/transitions';
import { cn } from '@/lib/utils';

export function StepTransition() {
  const { transitionType, setTransitionType } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-drift-400 mb-2">
          Step 1 of 3
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2">
          What transition are you navigating?
        </h1>
        <p className="text-muted-foreground">
          Select the one that feels most present right now
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        {transitionOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setTransitionType(option.id)}
            className={cn(
              'group relative p-4 rounded-xl border text-left transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-lg',
              transitionType === option.id
                ? 'border-drift-400 bg-drift-400/10 shadow-lg shadow-drift-400/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            )}
          >
            <div className="flex items-start gap-3">
              <span 
                className="text-2xl"
                style={{ color: option.color }}
              >
                {option.icon}
              </span>
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  {option.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
            
            {/* Selection indicator */}
            {transitionType === option.id && (
              <div 
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{ backgroundColor: option.color }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}