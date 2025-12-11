'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '@/lib/stores/onboarding-store';
import { StepTransition } from '@/components/onboarding/step-transition';
import { StepFeeling } from '@/components/onboarding/step-feeling';
import { StepContext } from '@/components/onboarding/step-context';
import { useToast } from '@/components/ui/use-toast';

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    step, 
    setStep, 
    transitionType, 
    feeling, 
    context,
    reset 
  } = useOnboardingStore();

  const canProceed = () => {
    if (step === 1) return transitionType !== null;
    if (step === 2) return feeling !== null;
    if (step === 3) return true; // Context is optional
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!transitionType || !feeling) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transitionType,
          initialFeeling: feeling,
          initialContext: context || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create journey');
      }

      toast({
        title: 'Your journey begins! 🌟',
        description: 'We\'ve created a personalized roadmap for you.',
      });

      reset(); // Clear onboarding state
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-drift-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-sage-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <span className="font-display text-2xl text-drift-400">drift</span>
        </header>

        {/* Progress bar */}
        <div className="px-6 mb-8">
          <div className="max-w-xl mx-auto">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-drift-400 to-drift-500 transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-32">
          <div className="w-full max-w-2xl animate-fade-up">
            {step === 1 && <StepTransition />}
            {step === 2 && <StepFeeling />}
            {step === 3 && <StepContext />}
          </div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-transparent">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed()}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating your journey...
                  </>
                ) : (
                  <>
                    Start my journey
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}