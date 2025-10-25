import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { user, plan, userProfile, notificationPreference } from '@/lib/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { sendWeeklyReminderEmail } from '@/lib/email/resend';
import { getPlanWithDetails, getNextMilestone } from '@/lib/utils/plan-helpers';

/**
 * Cron job for sending weekly email reminders
 * Schedule: Every Monday at 10 AM
 * Vercel Cron: 0 10 * * 1
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Get users who:
    // 1. Have an active plan
    // 2. Haven't had activity in 7+ days
    // 3. Have email reminders enabled
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const inactiveUsers = await db
      .select({
        userId: user.id,
        email: user.email,
        firstName: userProfile.firstName,
        planId: plan.id,
        estimatedDuration: plan.estimatedDuration,
        lastActivityAt: plan.lastActivityAt,
        emailReminders: notificationPreference.emailReminders,
      })
      .from(user)
      .innerJoin(userProfile, eq(userProfile.userId, user.id))
      .innerJoin(plan, eq(plan.userId, user.id))
      .leftJoin(notificationPreference, eq(notificationPreference.userId, user.id))
      .where(
        and(
          eq(plan.status, 'active'),
          lte(plan.lastActivityAt, sevenDaysAgo)
        )
      );

    console.log(`Found ${inactiveUsers.length} inactive users to remind`);

    const results = await Promise.allSettled(
      inactiveUsers.map(async (userData) => {
        try {
          // Get full plan details
          const fullPlan = await getPlanWithDetails(userData.planId);
          if (!fullPlan) {
            throw new Error('Plan not found');
          }

          // Get next milestone
          const nextMilestone = getNextMilestone(fullPlan);
          if (!nextMilestone) {
            throw new Error('No next milestone found');
          }

          // Get next 3 incomplete tasks from the milestone
          const nextTasks = nextMilestone.tasks
            .filter((t: any) => !t.isCompleted)
            .slice(0, 3)
            .map((t: any) => t.title);

          // Calculate overall progress
          let totalProgress = 0;
          if (fullPlan.phases && fullPlan.phases.length > 0) {
            const phaseCount = fullPlan.phases.length;
            fullPlan.phases.forEach((phase: any) => {
              if (phase.milestones && phase.milestones.length > 0) {
                const milestoneCount = phase.milestones.length;
                const completedMilestones = phase.milestones.filter(
                  (m: any) => m.isCompleted
                ).length;
                totalProgress += (completedMilestones / milestoneCount) * (1 / phaseCount);
              }
            });
          }
          const progress = Math.round(totalProgress * 100);

          // Send reminder email
          return await sendWeeklyReminderEmail({
            userId: userData.userId,
            to: userData.email,
            firstName: userData.firstName,
            progress,
            currentMilestone: nextMilestone.title,
            nextTasks,
          });
        } catch (error) {
          console.error(`Failed to send reminder to ${userData.email}:`, error);
          throw error;
        }
      })
    );

    // Count successes and failures
    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Email reminders: ${sent} sent, ${failed} failed`);

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: inactiveUsers.length,
    });
  } catch (error) {
    console.error('Email reminder cron error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send reminders',
      },
      { status: 500 }
    );
  }
}

