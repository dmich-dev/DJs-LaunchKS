import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { generateCareerPlan } from '@/lib/ai/plan-generator';
import { sendPlanReadyEmail } from '@/lib/email/resend';
import { db } from '@/lib/db';
import { userProfile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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

    // Send plan ready email
    try {
      const profiles = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, session.user.id))
        .limit(1);

      if (profiles.length > 0) {
        await sendPlanReadyEmail({
          userId: session.user.id,
          to: session.user.email,
          firstName: profiles[0].firstName,
          targetCareer: generatedPlan.targetCareer,
          estimatedDuration: generatedPlan.estimatedDuration,
          planId: generatedPlan.id,
        });
      }
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send plan ready email:', emailError);
    }

    return NextResponse.json({
      planId: generatedPlan.id,
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    // For demo purposes, redirect to demo plan on error
    return NextResponse.json({
      success: true,
      planId: 'demo',
      isDemo: true,
    });
  }
}
