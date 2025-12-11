'use client';

import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { transitionOptions } from '@/lib/data/transitions';

export function StepContext() {
  const { transitionType, context, setContext } = useOnboardingStore();
  
  const selectedTransition = transitionOptions.find(t => t.id === transitionType);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-drift-400 mb-2">
          Step 3 of 3
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-light text-foreground mb-2">
          Tell me a bit more
        </h1>
        <p className="text-muted-foreground">
          What's on your mind about this transition? (Optional)
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={`I'm going through a ${selectedTransition?.label.toLowerCase() || 'change'} and the hardest part is...`}
          className={`
            w-full h-40 px-4 py-3 rounded-xl
            bg-white/5 border border-white/10
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-drift-400/50 focus:border-drift-400
            resize-none transition-all
          `}
          maxLength={1000}
        />
        <p className="text-right text-sm text-muted-foreground mt-2">
          {context.length}/1000
        </p>
      </div>
    </div>
  );
}