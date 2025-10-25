import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { milestone, phase, plan } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { milestoneId } = await request.json();

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      );
    }

    // Get milestone and verify ownership
    const milestones = await db
      .select()
      .from(milestone)
      .where(eq(milestone.id, milestoneId))
      .limit(1);

    if (milestones.length === 0) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    const milestoneData = milestones[0];

    // Verify phase and plan ownership
    const phases = await db
      .select({ planId: phase.planId })
      .from(phase)
      .where(eq(phase.id, milestoneData.phaseId))
      .limit(1);

    if (phases.length === 0) {
      return NextResponse.json(
        { error: 'Phase not found' },
        { status: 404 }
      );
    }

    const plans = await db
      .select()
      .from(plan)
      .where(
        and(
          eq(plan.id, phases[0].planId),
          eq(plan.userId, session.user.id)
        )
      )
      .limit(1);

    if (plans.length === 0) {
      return NextResponse.json(
        { error: 'Plan not found or unauthorized' },
        { status: 404 }
      );
    }

    // Mark milestone as skipped (mark as completed to skip)
    await db
      .update(milestone)
      .set({
        isCompleted: true,
        completedAt: new Date(),
      })
      .where(eq(milestone.id, milestoneId));

    // Update plan last activity
    await db
      .update(plan)
      .set({ lastActivityAt: new Date() })
      .where(eq(plan.id, phases[0].planId));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error skipping milestone:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to skip milestone',
      },
      { status: 500 }
    );
  }
}

