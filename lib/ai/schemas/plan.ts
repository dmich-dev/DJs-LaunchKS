import { z } from 'zod';

export const resourceSchema = z.object({
  title: z.string().describe('Resource title'),
  description: z.string().describe('Brief description'),
  url: z.string().url().describe('Direct link to resource'),
  type: z.enum(['course', 'certification', 'program', 'job_listing', 'article', 'video', 'other']),
  cost: z.string().describe('Cost (e.g., "Free", "$49", "$500-1000")'),
  duration: z.string().nullable().describe('Duration (e.g., "6 weeks", "Self-paced")'),
  location: z.enum(['online', 'in_person', 'hybrid']).nullable(),
  provider: z.string().nullable().describe('Provider name (e.g., "Kansas City Community College")'),
  isAccredited: z.boolean().nullable().describe('Whether the program is accredited'),
});

export const taskSchema = z.object({
  title: z.string().describe('Task title (action-oriented)'),
  description: z.string().describe('Detailed description of what to do'),
  orderIndex: z.number().describe('Order within milestone'),
});

export const milestoneSchema = z.object({
  title: z.string().describe('Milestone title'),
  description: z.string().describe('What this milestone accomplishes'),
  orderIndex: z.number().describe('Order within phase'),
  completionCriteria: z.string().describe('How to know when this is complete'),
  verificationRequired: z.boolean().describe('Whether proof is needed'),
  tasks: z.array(taskSchema).min(3).max(8).describe('Specific tasks to complete'),
  resources: z.array(resourceSchema).min(1).describe('Helpful resources'),
});

export const phaseSchema = z.object({
  title: z.string().describe('Phase title'),
  description: z.string().describe('What this phase accomplishes'),
  estimatedDuration: z.string().describe('Estimated duration (e.g., "2-3 months")'),
  orderIndex: z.number().describe('Order in plan'),
  milestones: z.array(milestoneSchema).min(3).max(6).describe('Milestones in this phase'),
});

export const planSchema = z.object({
  targetCareer: z.string().describe('Target career title'),
  currentCareer: z.string().describe('Current career or "unemployed"'),
  estimatedDuration: z.string().describe('Total estimated duration'),
  salaryExpectations: z.object({
    entry: z.string().describe('Entry-level salary in Kansas'),
    experienced: z.string().describe('Experienced salary in Kansas'),
  }),
  jobMarketOutlook: z.string().describe('Kansas job market outlook for this career'),
  phases: z.array(phaseSchema).min(3).max(5).describe('Career transition phases'),
});

export type Resource = z.infer<typeof resourceSchema>;
export type Task = z.infer<typeof taskSchema>;
export type Milestone = z.infer<typeof milestoneSchema>;
export type Phase = z.infer<typeof phaseSchema>;
export type Plan = z.infer<typeof planSchema>;
