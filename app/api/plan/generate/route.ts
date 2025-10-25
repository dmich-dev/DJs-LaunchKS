import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { generateCareerPlan } from '@/lib/ai/plan-generator';

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

    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Generate plan (async process)
    const generatedPlan = await generateCareerPlan({
      userId: session.user.id,
      conversationId,
    });

    return NextResponse.json({
      success: true,
      planId: generatedPlan.id,
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate plan',
      },
      { status: 500 }
    );
  }
}
