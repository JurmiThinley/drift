import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db/prisma';
import { generateResponse } from '@/lib/ai/openrouter';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;
    const { content } = await request.json();

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        journey: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 20, // Last 20 messages for context
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (conversation.journey.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Save user's message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'USER',
        content: content.trim(),
      },
    });

    // Build conversation history for AI
    const conversationHistory = conversation.messages.map((msg) => ({
      role: msg.role.toLowerCase() as 'user' | 'assistant',
      content: msg.content,
    }));

    // Generate AI response
    const aiResponseText = await generateResponse(content.trim(), {
      transitionType: conversation.journey.transitionType as any,
      initialFeeling: conversation.journey.initialFeeling as any,
      initialContext: conversation.journey.initialContext,
      currentPhase: conversation.journey.currentPhase,
      userName: session.user.name ?? null,
      conversationHistory,
    });

    // Save AI's response
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: aiResponseText,
      },
    });

    // Update message count
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        messageCount: { increment: 2 },
      },
    });

    // Check for first conversation milestone
    const messageCount = await prisma.message.count({
      where: {
        conversation: {
          journey: { userId: session.user.id },
        },
        role: 'USER',
      },
    });

    if (messageCount === 1) {
      await prisma.milestone.upsert({
        where: {
          journeyId_milestoneKey: {
            journeyId: conversation.journey.id,
            milestoneKey: 'first_conversation',
          },
        },
        create: {
          journeyId: conversation.journey.id,
          milestoneKey: 'first_conversation',
          title: 'First Conversation',
          description: 'You had your first chat with Drift!',
        },
        update: {},
      });
    }

    return NextResponse.json({
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET - Get all messages in a conversation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: conversationId } = params;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        journey: true,
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    if (conversation.journey.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ messages: conversation.messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}