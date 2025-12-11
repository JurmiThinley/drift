import { TransitionType, FeelingType } from '@/lib/stores/onboarding-store';

export const transitionOptions: {
  id: TransitionType;
  icon: string;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'CAREER',
    icon: '◈',
    label: 'Career Change',
    description: 'New job, layoff, career pivot, or retirement',
    color: '#E8B4A0',
  },
  {
    id: 'MOVE',
    icon: '⌂',
    label: 'Moving',
    description: 'Relocating to a new city or country',
    color: '#A0C4B8',
  },
  {
    id: 'PARENT',
    icon: '❋',
    label: 'Becoming a Parent',
    description: 'Pregnancy, adoption, or new parenting journey',
    color: '#C4A0D4',
  },
  {
    id: 'HEALTH',
    icon: '✧',
    label: 'Health Journey',
    description: 'New diagnosis, recovery, or lifestyle change',
    color: '#D4C4A0',
  },
  {
    id: 'RELATIONSHIP',
    icon: '◇',
    label: 'Relationship Change',
    description: 'Divorce, breakup, or major relationship shift',
    color: '#A0B8D4',
  },
  {
    id: 'RETIREMENT',
    icon: '☼',
    label: 'Retirement',
    description: 'Transitioning out of the workforce',
    color: '#D4A0A0',
  },
];

export const feelingOptions: {
  id: FeelingType;
  emoji: string;
  label: string;
}[] = [
  { id: 'OVERWHELMED', emoji: '🌊', label: 'Overwhelmed' },
  { id: 'HOPEFUL', emoji: '🌱', label: 'Hopeful' },
  { id: 'UNCERTAIN', emoji: '🌫️', label: 'Uncertain' },
  { id: 'ENERGIZED', emoji: '⚡', label: 'Energized' },
  { id: 'STUCK', emoji: '🪨', label: 'Stuck' },
  { id: 'CAUTIOUSLY_OPTIMISTIC', emoji: '🌤️', label: 'Cautiously Optimistic' },
];