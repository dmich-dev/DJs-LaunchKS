// Re-export database types
export * from './db';

// Plan status types
export type PlanStatus = 'active' | 'completed' | 'archived';
export type PhaseStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type MilestoneStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';
export type ConversationStatus = 'in_progress' | 'completed' | 'abandoned';

// Message types
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

// Resource types
export type ResourceType = 'course' | 'certification' | 'job_listing' | 'article' | 'video' | 'program' | 'other';
export type ResourceLocation = 'online' | 'in_person' | 'hybrid';

// Analytics types
export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalPlans: number;
  completedPlans: number;
  completionRate: number;
  averageCompletionTimeDays: number;
  userGrowth: Array<{ date: string; count: number }>;
  topTransitions: Array<{ from: string; to: string; count: number }>;
  dropoffPoints: Array<{ phase: string; dropoffRate: number }>;
}

// Progress types
export interface ProgressMetrics {
  overall: number;
  daysActive: number;
  currentPhase: string;
  completedMilestones: number;
  totalMilestones: number;
  streak: number;
  timeRemaining: string;
  resourcesClicked: number;
}
