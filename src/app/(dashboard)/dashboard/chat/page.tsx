import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { MessageCircle, Map, Calendar, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGreeting } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Get user's journey with stats
  const journey = await prisma.journey.findFirst({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
    },
    include: {
      tasks: true,
      milestones: { orderBy: { achievedAt: 'desc' }, take: 3 },
      checkIns: { orderBy: { checkInDate: 'desc' }, take: 7 },
      _count: { select: { conversations: true } },
    },
  });

  if (!journey) {
    redirect('/onboarding');
  }

  const completedTasks = journey.tasks.filter((t) => t.completed).length;
  const totalTasks = journey.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const transitionLabels: Record<string, string> = {
    CAREER: 'Career Change',
    MOVE: 'Relocation',
    PARENT: 'Becoming a Parent',
    HEALTH: 'Health Journey',
    RELATIONSHIP: 'Relationship Change',
    RETIREMENT: 'Retirement',
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950">
      {/* Header */}
      <header className="border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-display text-2xl text-drift-400">drift</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Welcome section */}
        <section>
          <h1 className="font-display text-3xl text-foreground mb-2">
            {getGreeting()}, {session.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            You're on day {journey.streakDays || 1} of your {transitionLabels[journey.transitionType]?.toLowerCase()} journey.
          </p>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Chat card */}
          <Link href="/chat" className="block group">
            <div className="glass rounded-2xl p-6 border border-white/10 hover:border-drift-400/50 transition-all hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-drift-400/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-drift-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-drift-400 transition-colors" />
              </div>
              <h2 className="text-lg font-medium text-foreground mb-1">Chat with Drift</h2>
              <p className="text-sm text-muted-foreground">
                Talk through what's on your mind
              </p>
              <p className="text-xs text-drift-400 mt-3">
                {journey._count.conversations} conversations
              </p>
            </div>
          </Link>

          {/* Roadmap card */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-sage-300/20 flex items-center justify-center">
                <Map className="w-6 h-6 text-sage-300" />
              </div>
            </div>
            <h2 className="text-lg font-medium text-foreground mb-1">Your Roadmap</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Phase {journey.currentPhase} of 4
            </p>
            {/* Progress bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sage-300 to-sage-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} tasks complete
            </p>
          </div>
        </section>

        {/* Recent milestones */}
        {journey.milestones.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-drift-400" />
              Recent Milestones
            </h2>
            <div className="space-y-2">
              {journey.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="glass rounded-xl p-4 border border-white/10 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-drift-400/20 flex items-center justify-center">
                    🏆
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}