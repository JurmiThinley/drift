import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { z } from 'zod';

const checkInSchema = z.object({
  moodScore: z.number().min(1).max(5),
  reflection: z.string().max(1000).optional(),
});

// POST - Create check-in
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = checkInSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { moodScore, reflection } = result.data;

    // Get active journey
    const journey = await prisma.journey.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
    });

    if (!journey) {
      return NextResponse.json(
        { error: 'No active journey found' },
        { status: 404 }
      );
    }

    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingCheckIn = await prisma.checkIn.findUnique({
      where: {
        journeyId_checkInDate: {
          journeyId: journey.id,
          checkInDate: today,
        },
      },
    });

    if (existingCheckIn) {
      // Update existing check-in
      const updated = await prisma.checkIn.update({
        where: { id: existingCheckIn.id },
        data: { moodScore, reflection },
      });
      return NextResponse.json({ checkIn: updated, updated: true });
    }

    // Calculate streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayCheckIn = await prisma.checkIn.findUnique({
      where: {
        journeyId_checkInDate: {
          journeyId: journey.id,
          checkInDate: yesterday,
        },
      },
    });

    let newStreak = 1;
    if (yesterdayCheckIn) {
      newStreak = journey.streakDays + 1;
    }

    const newLongestStreak = Math.max(newStreak, journey.longestStreak);

    // Create check-in and update journey streak
    const [checkIn] = await prisma.$transaction([
      prisma.checkIn.create({
        data: {
          journeyId: journey.id,
          moodScore,
          reflection,
          checkInDate: today,
        },
      }),
      prisma.journey.update({
        where: { id: journey.id },
        data: {
          streakDays: newStreak,
          longestStreak: newLongestStreak,
        },
      }),
    ]);

    // Check for streak milestones
    const streakMilestones = [
      { days: 7, key: 'streak_7', title: '7 Day Streak', description: 'Checked in for 7 days in a row!' },
      { days: 14, key: 'streak_14', title: '14 Day Streak', description: 'Two weeks of consistency!' },
      { days: 30, key: 'streak_30', title: '30 Day Streak', description: 'A full month of check-ins!' },
    ];

    for (const milestone of streakMilestones) {
      if (newStreak === milestone.days) {
        await prisma.milestone.upsert({
          where: {
            journeyId_milestoneKey: {
              journeyId: journey.id,
              milestoneKey: milestone.key,
            },
          },
          create: {
            journeyId: journey.id,
            milestoneKey: milestone.key,
            title: milestone.title,
            description: milestone.description,
          },
          update: {},
        });
      }
    }

    return NextResponse.json(
      { 
        checkIn, 
        streak: newStreak,
        isNewStreak: !yesterdayCheckIn,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Failed to save check-in' },
      { status: 500 }
    );
  }
}

// GET - Get check-ins for current journey
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '7');

    const journey = await prisma.journey.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
    });

    if (!journey) {
      return NextResponse.json({ checkIns: [], streak: 0 });
    }

    const checkIns = await prisma.checkIn.findMany({
      where: { journeyId: journey.id },
      orderBy: { checkInDate: 'desc' },
      take: limit,
    });

    // Check if checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCheckIn = checkIns.find(
      (c) => new Date(c.checkInDate).getTime() === today.getTime()
    );

    return NextResponse.json({
      checkIns,
      streak: journey.streakDays,
      longestStreak: journey.longestStreak,
      checkedInToday: !!todayCheckIn,
      todayCheckIn,
    });
  } catch (error) {
    console.error('Get check-ins error:', error);
    return NextResponse.json(
      { error: 'Failed to get check-ins' },
      { status: 500 }
    );
  }
}