import { createClient } from '@/lib/supabase/server';
import { sendChatMessage } from '@/lib/claude';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user data and check subscription limits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) throw userError;

    // Check if free tier user has exceeded conversation limit
    if (userData.subscription_tier === 'free' && userData.conversations_this_month >= 10) {
      return NextResponse.json(
        { error: 'You have reached your monthly conversation limit. Please upgrade to continue.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { conversationId, message } = body;

    let currentConversationId = conversationId;

    // Create new conversation if none exists
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        })
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = newConversation.id;

      // Increment conversation count for free users
      if (userData.subscription_tier === 'free') {
        await supabase
          .from('users')
          .update({
            conversations_this_month: userData.conversations_this_month + 1,
          })
          .eq('id', user.id);
      }
    }

    // Save user message
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message,
      });

    if (userMessageError) throw userMessageError;

    // Get conversation history (last 15 messages)
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })
      .limit(15);

    if (messagesError) throw messagesError;

    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get AI response
    const aiResponse = await sendChatMessage(messages || [], userProfile);

    // Save AI response
    const { error: aiMessageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'assistant',
        content: aiResponse,
      });

    if (aiMessageError) throw aiMessageError;

    return NextResponse.json({
      conversationId: currentConversationId,
      message: aiResponse,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
