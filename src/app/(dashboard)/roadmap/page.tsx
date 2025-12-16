import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RoadmapPhases } from '@/components/roadmap/roadmap-phases';

export default async function RoadmapPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const journey = await prisma.journey.findFirst({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
    },
    include: {
      tasks: { orderBy: [{ phase: 'asc' }, { sortOrder: 'asc' }] },
    },
  });

  if (!journey) {
    redirect('/onboarding');
  }

  const transitionLabels: Record<string, string> = {
    CAREER: 'Career Change',
    MOVE: 'Relocation',
    PARENT: 'Becoming a Parent',
    HEALTH: 'Health Journey',
    RELATIONSHIP: 'Relationship Change',
    RETIREMENT: 'Retirement',
  };

  // Group tasks by phase
  const phases = [1, 2, 3, 4].map((phaseNum) => ({
    phase: phaseNum,
    tasks: journey.tasks.filter((t) => t.phase === phaseNum),
  }));

  const completedTasks = journey.tasks.filter((t) => t.completed).length;
  const totalTasks = journey.tasks.length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl text-foreground">Your Roadmap</h1>
            <p className="text-sm text-muted-foreground">
              {transitionLabels[journey.transitionType]} Journey
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-foreground">
              {completedTasks}/{totalTasks}
            </p>
            <p className="text-xs text-muted-foreground">tasks complete</p>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-drift-400 to-sage-300 transition-all duration-500"
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </div>

      {/* Phases */}
      <div className="max-w-4xl mx-auto p-4">
        <RoadmapPhases 
          phases={phases} 
          currentPhase={journey.currentPhase}
        />
      </div>
    </main>
  );
}