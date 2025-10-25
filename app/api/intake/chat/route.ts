import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from 'ai';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { userProfile, conversation, message } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { aiModel, getIntakeSystemPrompt, availableTools } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { messages, conversationId }: { messages: UIMessage[]; conversationId?: string } = await req.json();

    // Get user profile
    const profiles = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete onboarding first.' },
        { status: 404 }
      );
    }

    const profile = profiles[0];

    // Get or create conversation
    let currentConversation;
    if (conversationId) {
      const conversations = await db
        .select()
        .from(conversation)
        .where(eq(conversation.id, conversationId))
        .limit(1);

      if (conversations.length > 0) {
        currentConversation = conversations[0];
      }
    }

    if (!currentConversation) {
      // Create new intake conversation
      const [newConversation] = await db
        .insert(conversation)
        .values({
          userId: session.user.id,
          title: 'Career Planning Conversation',
          type: 'intake',
          status: 'active',
        })
        .returning();

      currentConversation = newConversation;
    }

    // Save user message to database
    const userMessage = messages[messages.length - 1];
    const userMessageText = userMessage.parts
      .filter(part => part.type === 'text')
      .map(part => (part as { type: 'text'; text: string }).text)
      .join('\n');

    await db.insert(message).values({
      conversationId: currentConversation.id,
      role: 'user',
      content: userMessageText,
    });

    // Stream AI response
    const result = streamText({
      model: aiModel,
      system: getIntakeSystemPrompt(profile),
      messages: convertToModelMessages(messages),
      tools: availableTools,
      stopWhen: stepCountIs(5),
      onFinish: async ({ text, toolCalls, toolResults }) => {
        // Save assistant message to database
        await db.insert(message).values({
          conversationId: currentConversation.id,
          role: 'assistant',
          content: text,
          toolInvocations: toolCalls && toolCalls.length > 0
            ? JSON.stringify({ calls: toolCalls, results: toolResults })
            : null,
        });

        // Update conversation timestamp
        await db
          .update(conversation)
          .set({ updatedAt: new Date() })
          .where(eq(conversation.id, currentConversation.id));
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        'X-Conversation-Id': currentConversation.id,
      },
      messageMetadata: () => ({
        conversationId: currentConversation.id,
      }),
    });
  } catch (error) {
    console.error('Intake chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat' },
      { status: 500 }
    );
  }
}
