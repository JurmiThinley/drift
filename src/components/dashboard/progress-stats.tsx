import { CheckCircle, Target, Flame, Trophy } from 'lucide-react';

interface ProgressStatsProps {
  completedTasks: number;
  totalTasks: number;
  currentPhase: number;
  streakDays: number;
  longestStreak: number;
  milestonesCount: number;
}

export function ProgressStats({
  completedTasks,
  totalTasks,
  currentPhase,
  streakDays,
  longestStreak,
  milestonesCount,
}: ProgressStatsProps) {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Progress',
      value: `${progress}%`,
      subtext: `${completedTasks}/${totalTasks} tasks`,
      color: 'text-sage-300',
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Phase',
      value: `${currentPhase}/4`,
      subtext: 'Current phase',
      color: 'text-drift-400',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Streak',
      value: `${streakDays}`,
      subtext: `Best: ${longestStreak}`,
      color: 'text-orange-400',
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: 'Milestones',
      value: `${milestonesCount}`,
      subtext: 'Earned',
      color: 'text-yellow-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass rounded-xl p-4 border border-white/10"
        >
          <div className={`${stat.color} mb-2`}>{stat.icon}</div>
          <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.subtext}</p>
        </div>
      ))}
    </div>
  );
}