import { TransitionType } from '@/lib/stores/onboarding-store';

interface RoadmapPhase {
  title: string;
  duration: string;
  tasks: string[];
}

interface Roadmap {
  phases: RoadmapPhase[];
}

const roadmapTemplates: Record<TransitionType, Roadmap> = {
  CAREER: {
    phases: [
      {
        title: 'Acknowledge & Orient',
        duration: 'Week 1-2',
        tasks: [
          'Process your initial emotions about this change',
          'Identify your support network',
          'Set one grounding daily ritual',
          'Write down your top 5 career accomplishments',
        ],
      },
      {
        title: 'Explore & Research',
        duration: 'Week 3-4',
        tasks: [
          'Clarify your values and priorities',
          'Research potential career paths',
          'Update your resume and LinkedIn',
          'Reach out to 3 people in your network',
        ],
      },
      {
        title: 'Take Action',
        duration: 'Week 5-8',
        tasks: [
          'Apply to 5 positions that excite you',
          'Practice interview responses',
          'Attend one networking event or webinar',
          'Build or update your portfolio',
        ],
      },
      {
        title: 'Integrate & Reflect',
        duration: 'Week 9-12',
        tasks: [
          'Evaluate opportunities against your values',
          'Negotiate offers thoughtfully',
          'Plan your transition timeline',
          'Celebrate your progress',
        ],
      },
    ],
  },
  MOVE: {
    phases: [
      {
        title: 'Acknowledge & Orient',
        duration: 'Week 1-2',
        tasks: [
          'Process emotions about leaving your current home',
          'Research your new location',
          'Create a moving timeline',
          'Set a realistic budget',
        ],
      },
      {
        title: 'Plan & Prepare',
        duration: 'Week 3-4',
        tasks: [
          'Declutter and decide what to keep',
          'Research neighborhoods in your new city',
          'Arrange housing (temporary or permanent)',
          'Notify important contacts of your move',
        ],
      },
      {
        title: 'Execute the Move',
        duration: 'Week 5-8',
        tasks: [
          'Pack systematically room by room',
          'Handle utilities and address changes',
          'Say meaningful goodbyes',
          'Document the journey',
        ],
      },
      {
        title: 'Settle & Connect',
        duration: 'Week 9-12',
        tasks: [
          'Explore your new neighborhood',
          'Find essential services (doctor, grocery, etc.)',
          'Join a local group or community',
          'Create new routines',
        ],
      },
    ],
  },
  PARENT: {
    phases: [
      {
        title: 'Acknowledge & Prepare',
        duration: 'Week 1-2',
        tasks: [
          'Process your emotions about becoming a parent',
          'Identify your support system',
          'Start learning about newborn care',
          'Discuss expectations with your partner',
        ],
      },
      {
        title: 'Plan & Nest',
        duration: 'Week 3-4',
        tasks: [
          'Prepare your home for baby',
          'Research childcare options if needed',
          'Create a birth or arrival plan',
          'Build your baby registry',
        ],
      },
      {
        title: 'Final Preparations',
        duration: 'Week 5-8',
        tasks: [
          'Pack hospital/go bag',
          'Meal prep and freeze food',
          'Set up baby essentials',
          'Practice self-care routines',
        ],
      },
      {
        title: 'Adjust & Bond',
        duration: 'Week 9-12',
        tasks: [
          'Establish feeding routines',
          'Accept help when offered',
          'Find moments for self-care',
          'Connect with other new parents',
        ],
      },
    ],
  },
  HEALTH: {
    phases: [
      {
        title: 'Acknowledge & Understand',
        duration: 'Week 1-2',
        tasks: [
          'Process your diagnosis or health news',
          'Research your condition from trusted sources',
          'Identify your care team',
          'Tell trusted people in your life',
        ],
      },
      {
        title: 'Build Your Plan',
        duration: 'Week 3-4',
        tasks: [
          'Understand your treatment options',
          'Create a medication/care schedule',
          'Identify lifestyle changes needed',
          'Set up a support system',
        ],
      },
      {
        title: 'Implement Changes',
        duration: 'Week 5-8',
        tasks: [
          'Start your treatment plan',
          'Track symptoms and progress',
          'Adjust daily routines as needed',
          'Communicate needs to work/family',
        ],
      },
      {
        title: 'Adapt & Thrive',
        duration: 'Week 9-12',
        tasks: [
          'Evaluate what\'s working',
          'Celebrate small health wins',
          'Build sustainable habits',
          'Connect with others on similar journeys',
        ],
      },
    ],
  },
  RELATIONSHIP: {
    phases: [
      {
        title: 'Acknowledge & Grieve',
        duration: 'Week 1-2',
        tasks: [
          'Allow yourself to feel the emotions',
          'Identify your immediate support network',
          'Establish basic self-care routines',
          'Secure your essentials (housing, finances)',
        ],
      },
      {
        title: 'Stabilize & Process',
        duration: 'Week 3-4',
        tasks: [
          'Consider professional support (therapist)',
          'Handle immediate logistics',
          'Set boundaries with your ex if needed',
          'Reconnect with friends and family',
        ],
      },
      {
        title: 'Rebuild & Rediscover',
        duration: 'Week 5-8',
        tasks: [
          'Rediscover your individual interests',
          'Create new routines that are yours',
          'Process lessons from the relationship',
          'Focus on personal growth',
        ],
      },
      {
        title: 'Move Forward',
        duration: 'Week 9-12',
        tasks: [
          'Envision your future',
          'Set new personal goals',
          'Open yourself to new connections',
          'Celebrate your resilience',
        ],
      },
    ],
  },
  RETIREMENT: {
    phases: [
      {
        title: 'Acknowledge & Envision',
        duration: 'Week 1-2',
        tasks: [
          'Process emotions about leaving work',
          'Envision your ideal retirement',
          'Review your financial situation',
          'Talk to others who have retired',
        ],
      },
      {
        title: 'Plan Your Transition',
        duration: 'Week 3-4',
        tasks: [
          'Create a retirement budget',
          'Plan knowledge transfer at work',
          'Research health insurance options',
          'Identify activities you want to pursue',
        ],
      },
      {
        title: 'Wind Down Work',
        duration: 'Week 5-8',
        tasks: [
          'Complete handover documentation',
          'Say meaningful goodbyes to colleagues',
          'Set up your new daily structure',
          'Start one new hobby or activity',
        ],
      },
      {
        title: 'Embrace Your New Chapter',
        duration: 'Week 9-12',
        tasks: [
          'Establish your new routine',
          'Stay socially connected',
          'Find purpose through volunteering or hobbies',
          'Plan something exciting to look forward to',
        ],
      },
    ],
  },
};

export function generateRoadmap(transitionType: TransitionType): Roadmap {
  return roadmapTemplates[transitionType];
}

export function getRoadmapPhase(transitionType: TransitionType, phase: number): RoadmapPhase | null {
  const roadmap = roadmapTemplates[transitionType];
  return roadmap.phases[phase - 1] || null;
}