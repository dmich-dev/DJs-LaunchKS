import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import * as schema from '@/lib/db/schema';

// User types
export type User = InferSelectModel<typeof schema.user>;
export type InsertUser = InferInsertModel<typeof schema.user>;

// User Profile types
export type UserProfile = InferSelectModel<typeof schema.userProfile>;
export type InsertUserProfile = InferInsertModel<typeof schema.userProfile>;

// Notification Preference types
export type NotificationPreference = InferSelectModel<typeof schema.notificationPreference>;
export type InsertNotificationPreference = InferInsertModel<typeof schema.notificationPreference>;

// Email types
export type Email = InferSelectModel<typeof schema.email>;
export type InsertEmail = InferInsertModel<typeof schema.email>;

// Conversation types
export type Conversation = InferSelectModel<typeof schema.conversation>;
export type InsertConversation = InferInsertModel<typeof schema.conversation>;

// Message types
export type Message = InferSelectModel<typeof schema.message>;
export type InsertMessage = InferInsertModel<typeof schema.message>;

// Plan types
export type Plan = InferSelectModel<typeof schema.plan>;
export type InsertPlan = InferInsertModel<typeof schema.plan>;

// Phase types
export type Phase = InferSelectModel<typeof schema.phase>;
export type InsertPhase = InferInsertModel<typeof schema.phase>;

// Milestone types
export type Milestone = InferSelectModel<typeof schema.milestone>;
export type InsertMilestone = InferInsertModel<typeof schema.milestone>;

// Task types
export type Task = InferSelectModel<typeof schema.task>;
export type InsertTask = InferInsertModel<typeof schema.task>;

// Resource types
export type Resource = InferSelectModel<typeof schema.resource>;
export type InsertResource = InferInsertModel<typeof schema.resource>;
