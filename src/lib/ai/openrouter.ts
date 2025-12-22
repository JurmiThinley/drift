import OpenAI from 'openai';
import { TransitionType, FeelingType } from '@/lib/stores/onboarding-store';

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
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
  
  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...context.conversationHistory.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await openrouter.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: messages,
      max_tokens: 1024,
    });

    let content = response.choices[0]?.message?.content || "I'm here for you. Could you tell me more?";

// Clean up response - remove any system prompt leakage
if (content.includes('[SYSTEM]') || content.includes('<s>')) {
  // Find where the actual response starts (after system prompt)
  const markers = ['</s>', '[/INST]', '## Guidelines', 'Hi ', 'Hello ', 'Hey '];
  for (const marker of markers) {
    const index = content.lastIndexOf(marker);
    if (index !== -1 && marker.startsWith('Hi') || marker.startsWith('Hello') || marker.startsWith('Hey')) {
      content = content.substring(index);
      break;
    }
  }
  // If still has system content, try to extract just the greeting
  if (content.includes('[SYSTEM]')) {
    const lines = content.split('\n');
    const cleanLines = lines.filter(line => 
      !line.includes('[SYSTEM]') && 
      !line.includes('<s>') && 
      !line.includes('##') &&
      !line.includes('- They') &&
      !line.includes('- You') &&
      !line.includes('- Keep') &&
      line.trim() !== ''
    );
    content = cleanLines.join('\n').trim();
  }
}

return content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
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

## Guidelines
- Keep responses concise (2-3 paragraphs max)
- Personalize to their situation
- If they seem distressed, acknowledge it first
- You can use emoji sparingly for warmth 🌱
- Never claim to be human or a therapist`;
}

export async function generateFirstMessage(
  context: Omit<ConversationContext, 'conversationHistory'>
): Promise<string> {
  const systemPrompt = buildSystemPrompt({ ...context, conversationHistory: [] });
  
  try {
    const response = await openrouter.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: 'Introduce yourself warmly in 2-3 sentences and ask how I am doing with my transition.' 
        },
      ],
      max_tokens: 256,
    });

    return response.choices[0]?.message?.content || "Hi! I'm Drift. How are you feeling today?";
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return "Hi! I'm Drift, your companion through this transition. How are you feeling today?";
  }
}