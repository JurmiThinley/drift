import { create } from 'zustand';

export type TransitionType = 
  | 'CAREER' 
  | 'MOVE' 
  | 'PARENT' 
  | 'HEALTH' 
  | 'RELATIONSHIP' 
  | 'RETIREMENT';

export type FeelingType = 
  | 'OVERWHELMED' 
  | 'HOPEFUL' 
  | 'UNCERTAIN' 
  | 'ENERGIZED' 
  | 'STUCK' 
  | 'CAUTIOUSLY_OPTIMISTIC';

interface OnboardingState {
  step: number;
  transitionType: TransitionType | null;
  feeling: FeelingType | null;
  context: string;
  
  // Actions
  setStep: (step: number) => void;
  setTransitionType: (type: TransitionType) => void;
  setFeeling: (feeling: FeelingType) => void;
  setContext: (context: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  transitionType: null,
  feeling: null,
  context: '',
  
  setStep: (step) => set({ step }),
  setTransitionType: (transitionType) => set({ transitionType }),
  setFeeling: (feeling) => set({ feeling }),
  setContext: (context) => set({ context }),
  reset: () => set({ step: 1, transitionType: null, feeling: null, context: '' }),
}));