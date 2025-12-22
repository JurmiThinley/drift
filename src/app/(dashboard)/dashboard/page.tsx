import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import Link from 'next/link';
import { MessageCircle, Map, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGreeting } from '@/lib/utils';
import { CheckInWidget } from '@/components/dashboard/check-in-widget';
import { MoodHistory } from '@/components/dashboard/mood-history';
import { ProgressStats } from '@/components/dashboard/progress-stats';
import { Navbar } from '@/components/layout/navbar';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  // Get user's journey with all related data
  const journey = await prisma.journey.findFirst({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
    },
    include: {
      tasks: true,
      milestones: { orderBy: { achievedAt: 'desc' } },
      checkIns: { orderBy: { checkInDate: 'desc' }, take: 7 },
      _count: { select: { conversations: true } },
    },
  });

  if (!journey) {
    redirect('/onboarding');
  }

  // Calculate stats
  const completedTasks = journey.tasks.filter((t) => t.completed).length;
  const totalTasks = journey.tasks.length;
  
  // Check if user checked in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCheckIn = journey.checkIns.find(
    (c) => new Date(c.checkInDate).setHours(0, 0, 0, 0) === today.getTime()
  );

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
      <Navbar email={session.user?.email} />

      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Welcome section */}
        <section>
          <h1 className="font-display text-3xl text-foreground mb-2">
            {getGreeting()}, {session.user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground">
            Day {journey.streakDays || 1} of your {transitionLabels[journey.transitionType]?.toLowerCase()} journey
          </p>
        </section>

        {/* Progress Stats */}
        <ProgressStats
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          currentPhase={journey.currentPhase}
          streakDays={journey.streakDays}
          longestStreak={journey.longestStreak}
          milestonesCount={journey.milestones.length}
        />

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Check-in widget */}
            <CheckInWidget
              initialStreak={journey.streakDays}
              initialCheckedInToday={!!todayCheckIn}
              initialTodayMood={todayCheckIn?.moodScore}
            />

            {/* Mood history */}
            <MoodHistory checkIns={journey.checkIns} />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Chat card */}
            <a href="/chat" className="block group cursor-pointer">
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
                  {journey._count.conversations} conversation{journey._count.conversations !== 1 ? 's' : ''}
                </p>
              </div>
            </a>

            {/* Roadmap card */}
            <a href="/roadmap" className="block group cursor-pointer">
              <div className="glass rounded-2xl p-6 border border-white/10 hover:border-sage-300/50 transition-all hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sage-300/20 flex items-center justify-center">
                    <Map className="w-6 h-6 text-sage-300" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-sage-300 transition-colors" />
                </div>
                <h2 className="text-lg font-medium text-foreground mb-1">Your Roadmap</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Phase {journey.currentPhase} of 4
                </p>
                {/* Progress bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sage-300 to-sage-400 transition-all"
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {completedTasks} of {totalTasks} tasks complete
                </p>
              </div>
            </a>

            {/* Recent milestones */}
            {journey.milestones.length > 0 && (
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h2 className="text-lg font-medium text-foreground mb-4">
                  Recent Milestones
                </h2>
                <div className="space-y-3">
                  {journey.milestones.slice(0, 3).map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                        🏆
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {milestone.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}