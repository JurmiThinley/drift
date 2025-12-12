import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { generateFirstMessage } from '@/lib/ai/openrouter';

// POST - Create new conversation
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's active journey
    const journey = await prisma.journey.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
    });

    if (!journey) {
      return NextResponse.json(
        { error: 'No active journey found' },
        { status: 404 }
      );
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        journeyId: journey.id,
      },
    });

    // Generate AI's first message
    const firstMessage = await generateFirstMessage({
      transitionType: journey.transitionType as any,
      initialFeeling: journey.initialFeeling as any,
      initialContext: journey.initialContext,
      currentPhase: journey.currentPhase,
      userName: session.user.name ?? null,
    });

    // Save AI's first message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: firstMessage,
      },
    });

    // Update message count
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { messageCount: 1 },
    });

    // Return conversation with first message
    const conversationWithMessages = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    return NextResponse.json(
      { conversation: conversationWithMessages },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

// GET - Get recent conversations
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const journey = await prisma.journey.findFirst({
      where: { userId: session.user.id, status: 'ACTIVE' },
    });

    if (!journey) {
      return NextResponse.json({ conversations: [] });
    }

    const conversations = await prisma.conversation.findMany({
      where: { journeyId: journey.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Just get first message for preview
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversations' },
      { status: 500 }
    );
  }
}