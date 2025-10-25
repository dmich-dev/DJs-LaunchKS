import { eq, and, asc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { plan, phase, milestone, task, resource } from '@/lib/db/schema';
import type { Plan, Phase, Milestone, Task } from '@/types/db';

export async function getActivePlan(userId: string) {
  const plans = await db
    .select()
    .from(plan)
    .where(
      and(
        eq(plan.userId, userId),
        eq(plan.status, 'active')
      )
    )
    .orderBy(plan.generatedAt)
    .limit(1);

  return plans[0] || null;
}

export async function getPlanWithDetails(planId: string) {
  // Get plan
  const plans = await db
    .select()
    .from(plan)
    .where(eq(plan.id, planId))
    .limit(1);

  if (plans.length === 0) {
    return null;
  }

  const planData = plans[0];

  // Get phases with milestones, tasks, and resources
  const phases = await db
    .select()
    .from(phase)
    .where(eq(phase.planId, planId))
    .orderBy(asc(phase.orderIndex));

  const phasesWithDetails = await Promise.all(
    phases.map(async (phaseData) => {
      const milestones = await db
        .select()
        .from(milestone)
        .where(eq(milestone.phaseId, phaseData.id))
        .orderBy(asc(milestone.orderIndex));

      const milestonesWithDetails = await Promise.all(
        milestones.map(async (milestoneData) => {
          const tasks = await db
            .select()
            .from(task)
            .where(eq(task.milestoneId, milestoneData.id))
            .orderBy(asc(task.orderIndex));

          const resources = await db
            .select()
            .from(resource)
            .where(eq(resource.milestoneId, milestoneData.id));

          return {
            ...milestoneData,
            tasks,
            resources,
          };
        })
      );

      return {
        ...phaseData,
        milestones: milestonesWithDetails,
      };
    })
  );

  return {
    ...planData,
    phases: phasesWithDetails,
  };
}

export function calculateOverallProgress(planWithDetails: any) {
  let totalTasks = 0;
  let completedTasks = 0;
  let totalMilestones = 0;
  let completedMilestones = 0;

  for (const phase of planWithDetails.phases) {
    for (const milestone of phase.milestones) {
      totalMilestones++;
      if (milestone.isCompleted) {
        completedMilestones++;
      }

      for (const task of milestone.tasks) {
        totalTasks++;
        if (task.isCompleted) {
          completedTasks++;
        }
      }
    }
  }

  const overall = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate days active
  const createdAt = new Date(planWithDetails.createdAt);
  const now = new Date();
  const daysActive = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  // Get current phase
  const currentPhaseIndex = planWithDetails.phases.findIndex((p: any) =>
    p.milestones.some((m: any) => !m.isCompleted)
  );
  const currentPhase = currentPhaseIndex >= 0
    ? planWithDetails.phases[currentPhaseIndex].title
    : planWithDetails.phases[planWithDetails.phases.length - 1]?.title || 'Complete';

  return {
    overall,
    completedTasks,
    totalTasks,
    completedMilestones,
    totalMilestones,
    daysActive: daysActive > 0 ? daysActive : 1,
    currentPhase,
  };
}

export function getNextMilestone(planWithDetails: any) {
  for (const phase of planWithDetails.phases) {
    for (const milestone of phase.milestones) {
      if (!milestone.isCompleted) {
        return {
          ...milestone,
          phase: phase.title,
          nextTasks: milestone.tasks.filter((t: any) => !t.isCompleted).slice(0, 3),
        };
      }
    }
  }

  // All milestones completed
  return null;
}

export function getUpcomingMilestones(planWithDetails: any, count: number = 3) {
  const upcoming = [];

  for (const phase of planWithDetails.phases) {
    for (const milestone of phase.milestones) {
      if (!milestone.isCompleted && upcoming.length < count) {
        upcoming.push({
          ...milestone,
          phase: phase.title,
        });
      }
    }
  }

  return upcoming;
}

export function calculateQuickStats(planWithDetails: any) {
  const progress = calculateOverallProgress(planWithDetails);

  return {
    completedMilestones: progress.completedMilestones,
    totalMilestones: progress.totalMilestones,
    completedTasks: progress.completedTasks,
    totalTasks: progress.totalTasks,
    resourcesAccessed: 0, // Would need tracking
    estimatedWeeksRemaining: estimateRemainingTime(planWithDetails),
  };
}

function estimateRemainingTime(planWithDetails: any): number {
  // Simple estimation based on uncompleted phases
  let remainingWeeks = 0;

  for (const phase of planWithDetails.phases) {
    const hasUncompletedMilestones = phase.milestones.some((m: any) => !m.isCompleted);
    if (hasUncompletedMilestones) {
      // Parse duration like "2-3 months" -> estimate in weeks
      const duration = phase.estimatedDuration.toLowerCase();
      if (duration.includes('month')) {
        const months = parseInt(duration.match(/\d+/)?.[0] || '2');
        remainingWeeks += months * 4;
      } else if (duration.includes('week')) {
        const weeks = parseInt(duration.match(/\d+/)?.[0] || '4');
        remainingWeeks += weeks;
      }
    }
  }

  return remainingWeeks;
}

export function getFeaturedResources(planWithDetails: any, count: number = 5) {
  const nextMilestone = getNextMilestone(planWithDetails);

  if (!nextMilestone || !nextMilestone.resources) {
    return [];
  }

  return nextMilestone.resources.slice(0, count);
}
