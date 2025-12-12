import Anthropic from '@anthropic-ai/sdk';
import { TransitionType, FeelingType } from '@/lib/stores/onboarding-store';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface ConversationContext {
  transitionType: TransitionType;
  initialFeeling: FeelingType;
  initialContext: string | null;
  currentPhase: number;
  userName: string | null;
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
}

export async function generateResponse(
  userMessage: string,
  context: ConversationContext
): Promise<string> {
  const systemPrompt = buildSystemPrompt(context);
  
  const messages = [
    ...context.conversationHistory,
    { role: 'user' as const, content: userMessage },
  ];

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    return textBlock ? textBlock.text : "I'm here for you. Could you tell me more?";
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate response');
  }
}

function buildSystemPrompt(context: ConversationContext): string {
  const transitionLabels: Record<TransitionType, string> = {
    CAREER: 'career change',
    MOVE: 'relocation',
    PARENT: 'becoming a parent',
    HEALTH: 'health journey',
    RELATIONSHIP: 'relationship change',
    RETIREMENT: 'retirement',
  };

  const feelingLabels: Record<FeelingType, string> = {
    OVERWHELMED: 'overwhelmed',
    HOPEFUL: 'hopeful',
    UNCERTAIN: 'uncertain',
    ENERGIZED: 'energized',
    STUCK: 'stuck',
    CAUTIOUSLY_OPTIMISTIC: 'cautiously optimistic',
  };

  const transition = transitionLabels[context.transitionType];
  const feeling = feelingLabels[context.initialFeeling];
  const name = context.userName || 'there';
  const phase = context.currentPhase;

  return `You are Drift, a warm and empathetic AI companion helping people navigate major life transitions. You're talking to ${name}.

## About This Person
- They're going through a ${transition}
- When they started, they felt ${feeling}
- They're currently in Phase ${phase} of their journey
${context.initialContext ? `- Their initial thoughts: "${context.initialContext}"` : ''}

## Your Personality
- Warm, supportive, and genuine — like a wise friend
- You listen deeply and reflect back what you hear
- You're encouraging but not dismissive of difficulties
- You ask thoughtful follow-up questions
- You celebrate small wins
- You gently offer perspective when helpful

## Guidelines
- Keep responses concise (2-4 paragraphs max)
- Don't give generic advice — personalize to their situation
- Don't be preachy or lecture them
- If they seem distressed, acknowledge it first before anything else
- You can use emoji sparingly for warmth 🌱
- Never claim to be human or a therapist
- If they need professional help, gently suggest it

## Important
- You're a companion, not a replacement for professional help
- Don't diagnose or provide medical/legal/financial advice
- Focus on emotional support and practical encouragement`;
}

export async function generateFirstMessage(context: Omit<ConversationContext, 'conversationHistory'>): Promise<string> {
  const systemPrompt = buildSystemPrompt({ ...context, conversationHistory: [] });
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: 'This is the start of our conversation. Please introduce yourself warmly and ask how I\'m doing today with my transition. Keep it brief and genuine.',
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    return textBlock ? textBlock.text : "Hi there! I'm Drift, and I'm here to support you through this transition. How are you feeling today?";
  } catch (error) {
    console.error('Claude API error:', error);
    return "Hi! I'm Drift, your companion through this transition. I'm glad you're here. How are you feeling today?";
  }
}