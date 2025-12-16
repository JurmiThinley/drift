import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';

// PATCH - Update task (complete/uncomplete)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = params;
    const { completed } = await request.json();

    // Get task and verify ownership
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { journey: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.journey.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    // Check for phase completion milestone
    if (completed) {
      const phaseTasks = await prisma.task.findMany({
        where: { journeyId: task.journeyId, phase: task.phase },
      });

      const allPhaseTasksComplete = phaseTasks.every((t) => 
        t.id === taskId ? completed : t.completed
      );

      if (allPhaseTasksComplete) {
        // Create phase completion milestone
        await prisma.milestone.upsert({
          where: {
            journeyId_milestoneKey: {
              journeyId: task.journeyId,
              milestoneKey: `phase_${task.phase}_complete`,
            },
          },
          create: {
            journeyId: task.journeyId,
            milestoneKey: `phase_${task.phase}_complete`,
            title: `Phase ${task.phase} Complete!`,
            description: `You've completed all tasks in phase ${task.phase}`,
          },
          update: {},
        });

        // Auto-advance to next phase if not at phase 4
        if (task.phase < 4) {
          await prisma.journey.update({
            where: { id: task.journeyId },
            data: { currentPhase: task.phase + 1 },
          });
        }

        // Check if all tasks complete (journey complete)
        const allTasks = await prisma.task.findMany({
          where: { journeyId: task.journeyId },
        });

        const allComplete = allTasks.every((t) =>
          t.id === taskId ? completed : t.completed
        );

        if (allComplete) {
          await prisma.journey.update({
            where: { id: task.journeyId },
            data: { 
              status: 'COMPLETED',
              completedAt: new Date(),
            },
          });

          await prisma.milestone.upsert({
            where: {
              journeyId_milestoneKey: {
                journeyId: task.journeyId,
                milestoneKey: 'journey_complete',
              },
            },
            create: {
              journeyId: task.journeyId,
              milestoneKey: 'journey_complete',
              title: 'Journey Complete! 🎉',
              description: 'You\'ve completed your entire transition journey!',
            },
            update: {},
          });
        }
      }
    }

    // Get updated stats
    const allTasks = await prisma.task.findMany({
      where: { journeyId: task.journeyId },
    });
    
    const completedCount = allTasks.filter((t) => 
      t.id === taskId ? completed : t.completed
    ).length;

    return NextResponse.json({
      task: updatedTask,
      stats: {
        completed: completedCount,
        total: allTasks.length,
        progress: Math.round((completedCount / allTasks.length) * 100),
      },
    });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}