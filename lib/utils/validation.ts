import { z } from 'zod';

// User Profile validation
export const userProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  location: z.string().min(1, 'Location is required').max(100),
  phoneNumber: z.string().optional().nullable(),
  isKansasResident: z.boolean().default(true),
  currentEmploymentStatus: z.enum(['employed', 'unemployed', 'student', 'other']),
  currentJobTitle: z.string().max(100).optional().nullable(),
  currentIndustry: z.string().max(100).optional().nullable(),
  yearsOfExperience: z.number().int().min(0).max(70).optional().nullable(),
  educationLevel: z.enum(['high_school', 'some_college', 'associates', 'bachelors', 'masters', 'doctorate', 'other']),
  availableHoursPerWeek: z.number().int().min(1).max(168),
  willingToRelocate: z.boolean(),
  hasTransportation: z.boolean(),
  financialSituation: z.enum(['can_afford_paid', 'needs_free_only', 'needs_assistance']),
  learningPreference: z.enum(['online', 'in_person', 'hybrid', 'self_paced']),
  barriers: z.array(z.string()).optional().default([]),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// Notification preferences validation
export const notificationPreferenceSchema = z.object({
  emailReminders: z.boolean().default(true),
  reminderFrequency: z.enum(['daily', 'weekly', 'biweekly']).default('weekly'),
  milestoneEmails: z.boolean().default(true),
  phaseCompletionEmails: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

export type NotificationPreferenceInput = z.infer<typeof notificationPreferenceSchema>;

// Task completion validation
export const taskCompletionSchema = z.object({
  taskId: z.string().uuid(),
  isCompleted: z.boolean(),
});

// Email validation
export const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  type: z.enum(['verification', 'password_reset', 'plan_ready', 'reminder', 'milestone_complete', 'phase_complete', 'admin_digest']),
});
