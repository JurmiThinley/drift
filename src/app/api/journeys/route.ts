import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { generateRoadmap } from '@/lib/roadmap';
import { z } from 'zod';

const createJourneySchema = z.object({
  transitionType: z.enum(['CAREER', 'MOVE', 'PARENT', 'HEALTH', 'RELATIONSHIP', 'RETIREMENT']),
  initialFeeling: z.enum(['OVERWHELMED', 'HOPEFUL', 'UNCERTAIN', 'ENERGIZED', 'STUCK', 'CAUTIOUSLY_OPTIMISTIC']),
  initialContext: z.string().max(1000).nullable().optional(),
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = createJourneySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { transitionType, initialFeeling, initialContext } = result.data;

    // Check if user already has an active journey
    const existingJourney = await prisma.journey.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
    });

    if (existingJourney) {
      return NextResponse.json(
        { error: 'You already have an active journey. Complete or pause it first.' },
        { status: 409 }
      );
    }

    // Generate roadmap based on transition type
    const roadmap = generateRoadmap(transitionType);

    // Create the journey
    const journey = await prisma.journey.create({
      data: {
        userId: session.user.id,
        transitionType,
        initialFeeling,
        initialContext,
      },
    });

    // Create tasks from roadmap
    const tasks = roadmap.phases.flatMap((phase: { title: string; duration: string; tasks: string[] }, phaseIndex: number) =>
      phase.tasks.map((task, taskIndex) => ({
        journeyId: journey.id,
        phase: phaseIndex + 1,
        title: task,
        sortOrder: taskIndex,
      }))
    );

    await prisma.task.createMany({
      data: tasks,
    });

    // Create first milestone
    await prisma.milestone.create({
      data: {
        journeyId: journey.id,
        milestoneKey: 'journey_started',
        title: 'Journey Started',
        description: 'You took the first step by starting your transition journey.',
      },
    });

    // Fetch complete journey with tasks
    const completeJourney = await prisma.journey.findUnique({
      where: { id: journey.id },
      include: {
        tasks: { orderBy: [{ phase: 'asc' }, { sortOrder: 'asc' }] },
        milestones: true,
      },
    });

    return NextResponse.json(
      { 
        message: 'Journey created successfully',
        journey: completeJourney,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Journey creation error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// GET current user's active journey
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const journey = await prisma.journey.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
      },
      include: {
        tasks: { orderBy: [{ phase: 'asc' }, { sortOrder: 'asc' }] },
        milestones: { orderBy: { achievedAt: 'desc' } },
        checkIns: { orderBy: { checkInDate: 'desc' }, take: 7 },
        _count: {
          select: {
            conversations: true,
          },
        },
      },
    });

    if (!journey) {
      return NextResponse.json(
        { journey: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ journey });
  } catch (error) {
    console.error('Journey fetch error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}