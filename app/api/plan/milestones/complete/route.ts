import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { milestone, phase, plan, userProfile } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sendMilestoneCompleteEmail, sendPhaseCompleteEmail } from '@/lib/email/resend';
import { getPlanWithDetails, calculateOverallProgress, getNextMilestone } from '@/lib/utils/plan-helpers';

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

    // Update milestone
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

    // Check if phase is complete (all milestones completed)
    const phaseMilestones = await db
      .select()
      .from(milestone)
      .where(eq(milestone.phaseId, milestoneData.phaseId));

    const allMilestonesComplete = phaseMilestones.every((m) => m.isCompleted);

    // Get full plan details for email
    const fullPlan = await getPlanWithDetails(phases[0].planId);
    if (fullPlan) {
      const progress = calculateOverallProgress(fullPlan);
      const nextMilestoneData = getNextMilestone(fullPlan);

      // Get user profile
      const profiles = await db
        .select()
        .from(userProfile)
        .where(eq(userProfile.userId, session.user.id))
        .limit(1);

      if (profiles.length > 0) {
        // Send milestone complete email
        try {
          await sendMilestoneCompleteEmail({
            userId: session.user.id,
            to: session.user.email,
            firstName: profiles[0].firstName,
            milestoneTitle: milestoneData.title,
            progress: progress.overall,
            nextMilestone: nextMilestoneData?.title || 'Continue your journey',
          });
        } catch (emailError) {
          console.error('Failed to send milestone complete email:', emailError);
        }

        // If phase is complete, send phase complete email
        if (allMilestonesComplete) {
          const currentPhase = fullPlan.phases.find(
            (p: any) => p.id === milestoneData.phaseId
          );
          const nextPhase = fullPlan.phases
            .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
            .find((p: any) => p.orderIndex > (currentPhase?.orderIndex || 0));

          try {
            await sendPhaseCompleteEmail({
              userId: session.user.id,
              to: session.user.email,
              firstName: profiles[0].firstName,
              phaseTitle: currentPhase?.title || 'Phase',
              progress: progress.overall,
              nextPhase: nextPhase?.title || 'Complete your plan',
            });
          } catch (emailError) {
            console.error('Failed to send phase complete email:', emailError);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      phaseComplete: allMilestonesComplete,
    });
  } catch (error) {
    console.error('Error completing milestone:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to complete milestone',
      },
      { status: 500 }
    );
  }
}

