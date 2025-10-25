import { generateObject } from 'ai';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { userProfile, conversation, message, plan, phase, milestone, task, resource } from '@/lib/db/schema';
import { aiModel } from './config';
import { getPlanGeneratorSystemPrompt } from './prompts';
import { planSchema } from './schemas/plan';
import type { UserProfile } from '@/types/db';

interface GeneratePlanOptions {
  userId: string;
  conversationId: string;
}

export async function generateCareerPlan({ userId, conversationId }: GeneratePlanOptions) {
  // Get user profile
  const profiles = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1);

  if (profiles.length === 0) {
    throw new Error('User profile not found');
  }

  const profile = profiles[0];

  // Get conversation messages
  const messages = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(message.createdAt);

  if (messages.length === 0) {
    throw new Error('No conversation messages found');
  }

  // Create conversation summary
  const conversationSummary = messages
    .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n\n');

  // Extract target career from conversation (simple heuristic - look at early messages)
  const userMessages = messages.filter(m => m.role === 'user');
  const targetCareer = extractTargetCareer(userMessages.map(m => m.content));
  const currentCareer = profile.currentJobTitle || profile.currentEmploymentStatus;

  // Generate plan using AI with retry logic
  let generatedPlan;
  let lastError;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await generateObject({
        model: aiModel,
        system: getPlanGeneratorSystemPrompt({
          profile,
          conversationSummary,
          currentCareer,
          targetCareer,
        }),
        prompt: `Generate a comprehensive career transition plan from "${currentCareer}" to "${targetCareer}".

CRITICAL REQUIREMENTS (plan will be rejected if not met):
- Create EXACTLY 3-5 phases (minimum 3)
- EACH phase needs EXACTLY 3-6 milestones (minimum 3)
- EACH milestone needs EXACTLY 3-8 tasks (minimum 3)
- EACH milestone needs AT LEAST 1 resource

Focus on Kansas-specific resources and realistic timelines based on ${profile.availableHoursPerWeek} hours/week availability.${attempt > 1 ? `\n\nPrevious attempt failed validation. Ensure ALL minimums are met.` : ''}`,
        schema: planSchema,
        schemaName: 'CareerPlan',
        schemaDescription: 'A comprehensive career transition plan with phases, milestones, tasks, and resources',
      });

      generatedPlan = result.object;
      break; // Success - exit retry loop
    } catch (error) {
      lastError = error;
      console.error(`Plan generation attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        // All retries failed - throw the error
        throw new Error(
          `Failed to generate valid plan after ${maxRetries} attempts. Last error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }

      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }

  if (!generatedPlan) {
    throw new Error('Failed to generate plan - no result after retries');
  }

  // Save plan to database
  const [savedPlan] = await db
    .insert(plan)
    .values({
      userId,
      conversationId,
      targetCareer: generatedPlan.targetCareer,
      currentCareer: generatedPlan.currentCareer,
      estimatedDuration: generatedPlan.estimatedDuration,
      salaryExpectationsEntry: generatedPlan.salaryExpectations.entry,
      salaryExpectationsExperienced: generatedPlan.salaryExpectations.experienced,
      jobMarketOutlook: generatedPlan.jobMarketOutlook,
      status: 'active',
      generatedAt: new Date(),
      lastActivityAt: new Date(),
    })
    .returning();

  // Save phases
  for (const phaseData of generatedPlan.phases) {
    const [savedPhase] = await db
      .insert(phase)
      .values({
        planId: savedPlan.id,
        title: phaseData.title,
        description: phaseData.description,
        estimatedDuration: phaseData.estimatedDuration,
        orderIndex: phaseData.orderIndex,
      })
      .returning();

    // Save milestones
    for (const milestoneData of phaseData.milestones) {
      const [savedMilestone] = await db
        .insert(milestone)
        .values({
          phaseId: savedPhase.id,
          title: milestoneData.title,
          description: milestoneData.description,
          orderIndex: milestoneData.orderIndex,
          completionCriteria: milestoneData.completionCriteria,
          verificationRequired: milestoneData.verificationRequired,
        })
        .returning();

      // Save tasks
      for (const taskData of milestoneData.tasks) {
        await db.insert(task).values({
          milestoneId: savedMilestone.id,
          title: taskData.title,
          description: taskData.description,
          orderIndex: taskData.orderIndex,
        });
      }

      // Save resources
      for (const resourceData of milestoneData.resources) {
        await db.insert(resource).values({
          milestoneId: savedMilestone.id,
          title: resourceData.title,
          description: resourceData.description,
          url: resourceData.url,
          type: resourceData.type,
          cost: resourceData.cost,
          duration: resourceData.duration,
          location: resourceData.location,
          provider: resourceData.provider,
          isAccredited: resourceData.isAccredited,
        });
      }
    }
  }

  // Update conversation status
  await db
    .update(conversation)
    .set({ status: 'completed' })
    .where(eq(conversation.id, conversationId));

  return savedPlan;
}

function extractTargetCareer(userMessages: string[]): string {
  // Simple heuristic: look for career mentions in first few messages
  const earlyMessages = userMessages.slice(0, 3).join(' ');

  // Common patterns
  const patterns = [
    /want to (?:be|become) (?:a |an )?([a-z\s]+?)(?:\.|,|$)/i,
    /interested in (?:being |becoming )?(?:a |an )?([a-z\s]+?)(?:\.|,|$)/i,
    /transition to (?:a |an )?([a-z\s]+?)(?:\.|,|$)/i,
    /career in ([a-z\s]+?)(?:\.|,|$)/i,
  ];

  for (const pattern of patterns) {
    const match = earlyMessages.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return 'new career'; // fallback
}
