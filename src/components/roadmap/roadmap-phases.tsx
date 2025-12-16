'use client';

import { useState } from 'react';
import { Check, Circle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  phase: number;
  title: string;
  description: string | null;
  completed: boolean;
  sortOrder: number;
}

interface Phase {
  phase: number;
  tasks: Task[];
}

interface RoadmapPhasesProps {
  phases: Phase[];
  currentPhase: number;
}

const phaseNames = [
  'Acknowledge & Orient',
  'Explore & Research', 
  'Take Action',
  'Integrate & Reflect',
];

export function RoadmapPhases({ phases, currentPhase }: RoadmapPhasesProps) {
  const [expandedPhase, setExpandedPhase] = useState<number>(currentPhase);
  const [tasks, setTasks] = useState<Task[]>(phases.flatMap((p) => p.tasks));
  const [loadingTask, setLoadingTask] = useState<string | null>(null);
  const { toast } = useToast();

  const togglePhase = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? 0 : phase);
  };

  const toggleTask = async (taskId: string, currentCompleted: boolean) => {
    setLoadingTask(taskId);

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !currentCompleted } : t
      )
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentCompleted }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      if (!currentCompleted) {
        toast({
          title: 'Task completed! ✓',
          description: `${data.stats.completed}/${data.stats.total} tasks done`,
        });
      }
    } catch (error) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, completed: currentCompleted } : t
        )
      );
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update task',
      });
    } finally {
      setLoadingTask(null);
    }
  };

  const getPhaseStatus = (phaseNum: number) => {
    const phaseTasks = tasks.filter((t) => t.phase === phaseNum);
    const completed = phaseTasks.filter((t) => t.completed).length;
    const total = phaseTasks.length;
    
    if (completed === total && total > 0) return 'complete';
    if (phaseNum > currentPhase) return 'locked';
    if (phaseNum === currentPhase) return 'current';
    return 'available';
  };

  return (
    <div className="space-y-4">
      {phases.map(({ phase }) => {
        const phaseTasks = tasks.filter((t) => t.phase === phase);
        const completedCount = phaseTasks.filter((t) => t.completed).length;
        const status = getPhaseStatus(phase);
        const isExpanded = expandedPhase === phase;

        return (
          <div
            key={phase}
            className={cn(
              'rounded-2xl border overflow-hidden transition-all',
              status === 'complete' && 'border-sage-300/50 bg-sage-300/5',
              status === 'current' && 'border-drift-400/50 bg-drift-400/5',
              status === 'available' && 'border-white/10 bg-white/5',
              status === 'locked' && 'border-white/5 bg-white/[0.02] opacity-60'
            )}
          >
            {/* Phase header */}
            <button
              onClick={() => status !== 'locked' && togglePhase(phase)}
              disabled={status === 'locked'}
              className={cn(
                'w-full p-4 flex items-center gap-4 text-left',
                status !== 'locked' && 'hover:bg-white/5'
              )}
            >
              {/* Phase number indicator */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold',
                  status === 'complete' && 'bg-sage-300 text-midnight-950',
                  status === 'current' && 'bg-drift-400 text-midnight-950',
                  status === 'available' && 'bg-white/10 text-foreground',
                  status === 'locked' && 'bg-white/5 text-muted-foreground'
                )}
              >
                {status === 'complete' ? (
                  <Check className="w-5 h-5" />
                ) : status === 'locked' ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  phase
                )}
              </div>

              {/* Phase info */}
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  Phase {phase}: {phaseNames[phase - 1]}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount}/{phaseTasks.length} tasks complete
                </p>
              </div>

              {/* Progress bar (mini) */}
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all',
                    status === 'complete' && 'bg-sage-300',
                    status === 'current' && 'bg-drift-400',
                    status === 'available' && 'bg-white/30',
                    status === 'locked' && 'bg-white/10'
                  )}
                  style={{ width: `${(completedCount / phaseTasks.length) * 100}%` }}
                />
              </div>

              {/* Expand icon */}
              {status !== 'locked' && (
                isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )
              )}
            </button>

            {/* Tasks list */}
            {isExpanded && status !== 'locked' && (
              <div className="px-4 pb-4 space-y-2">
                {phaseTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id, task.completed)}
                    disabled={loadingTask === task.id}
                    className={cn(
                      'w-full p-3 rounded-xl flex items-start gap-3 text-left transition-all',
                      'hover:bg-white/5',
                      task.completed && 'opacity-60'
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                        task.completed
                          ? 'bg-sage-300 border-sage-300'
                          : 'border-white/30 hover:border-drift-400'
                      )}
                    >
                      {task.completed && (
                        <Check className="w-4 h-4 text-midnight-950" />
                      )}
                    </div>

                    {/* Task info */}
                    <div className="flex-1">
                      <p
                        className={cn(
                          'font-medium',
                          task.completed
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'
                        )}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}