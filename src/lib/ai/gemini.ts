import { GoogleGenerativeAI } from '@google/generative-ai';
import { TransitionType, FeelingType } from '@/lib/stores/onboarding-store';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

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
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Build chat history for Gemini
    const history = context.conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `System instructions: ${systemPrompt}` }] },
        { role: 'model', parts: [{ text: 'I understand. I will act as Drift, a warm and empathetic AI companion.' }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text() || "I'm here for you. Could you tell me more?";
  } catch (error) {
    console.error('Gemini API error:', error);
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

export async function generateFirstMessage(
  context: Omit<ConversationContext, 'conversationHistory'>
): Promise<string> {
  const systemPrompt = buildSystemPrompt({ ...context, conversationHistory: [] });
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: `System instructions: ${systemPrompt}` }] },
        { role: 'model', parts: [{ text: 'I understand. I will act as Drift.' }] },
      ],
    });

    const result = await chat.sendMessage(
      'This is the start of our conversation. Please introduce yourself warmly and ask how I\'m doing today with my transition. Keep it brief and genuine (2-3 sentences max).'
    );
    const response = await result.response;
    return response.text() || "Hi there! I'm Drift, and I'm here to support you through this transition. How are you feeling today?";
  } catch (error) {
    console.error('Gemini API error:', error);
    return "Hi! I'm Drift, your companion through this transition. I'm glad you're here. How are you feeling today?";
  }
}