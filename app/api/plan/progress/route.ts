import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { task, milestone, plan } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, isCompleted } = body;

    if (!taskId || typeof isCompleted !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update task completion
    const [updatedTask] = await db
      .update(task)
      .set({
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      })
      .where(eq(task.id, taskId))
      .returning();

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Get the milestone and check if all tasks are completed
    const tasks = await db
      .select()
      .from(task)
      .where(eq(task.milestoneId, updatedTask.milestoneId));

    const allTasksCompleted = tasks.every((t) => t.isCompleted);

    // Update milestone completion if all tasks are done
    if (allTasksCompleted && !tasks.some((t) => !t.isCompleted)) {
      await db
        .update(milestone)
        .set({
          isCompleted: true,
          completedAt: new Date(),
        })
        .where(eq(milestone.id, updatedTask.milestoneId));
    } else {
      // Unmark milestone if not all tasks are completed
      await db
        .update(milestone)
        .set({
          isCompleted: false,
          completedAt: null,
        })
        .where(eq(milestone.id, updatedTask.milestoneId));
    }

    // Update plan's lastActivityAt
    const milestones = await db
      .select()
      .from(milestone)
      .where(eq(milestone.id, updatedTask.milestoneId))
      .limit(1);

    if (milestones.length > 0) {
      const milestoneData = milestones[0];
      const phases = await db.query.phase.findFirst({
        where: (phase, { eq }) => eq(phase.id, milestoneData.phaseId),
      });

      if (phases) {
        await db
          .update(plan)
          .set({ lastActivityAt: new Date() })
          .where(eq(plan.id, phases.planId));
      }
    }

    return NextResponse.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Error updating task progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
