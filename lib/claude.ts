import Anthropic from '@anthropic-ai/sdk';
import { UserProfile, Message } from '@/types/database.types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export function buildSystemPrompt(userProfile: UserProfile | null): string {
  if (!userProfile) {
    return `You are Advuman, an AI business consultant specializing in helping MSMEs and young professionals.

Provide specific, actionable advice tailored to their situation. Ask clarifying questions when needed. Be concise but thorough.`;
  }

  return `You are Advuman, an AI business consultant specializing in helping MSMEs and young professionals.

User Profile:
- Business: ${userProfile.business_name || 'Not specified'}
- Industry: ${userProfile.user_id || 'Not specified'}
- Stage: ${userProfile.business_stage || 'Not specified'}
- Team Size: ${userProfile.team_size || 'Not specified'}
- Monthly Revenue: ${userProfile.monthly_revenue || 'Not specified'}
- Primary Goal: ${userProfile.primary_goal || 'Not specified'}
- Key Challenges: ${userProfile.challenges?.join(', ') || 'Not specified'}

Provide specific, actionable advice tailored to their unique situation. Reference their profile context when relevant. Ask clarifying questions when needed. Be concise but thorough.`;
}

export async function sendChatMessage(
  messages: Pick<Message, 'role' | 'content'>[],
  userProfile: UserProfile | null
): Promise<string> {
  const systemPrompt = buildSystemPrompt(userProfile);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const textContent = response.content.find((block) => block.type === 'text');
    return textContent && 'text' in textContent ? textContent.text : 'I apologize, but I encountered an error processing your request.';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to get response from AI');
  }
}
