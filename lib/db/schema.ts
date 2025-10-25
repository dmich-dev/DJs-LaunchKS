import { pgTable, text, timestamp, boolean, index, uniqueIndex, integer } from "drizzle-orm/pg-core";

export const user = pgTable(
    'user',
    {
      id: text('id').primaryKey(),
      name: text('name').notNull(),
      email: text('email').notNull().unique(),
      emailVerified: boolean('emailVerified').notNull().default(false),
      image: text('image'),
      role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
      createdAt: timestamp('createdAt').notNull().defaultNow(),
      updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    },
    (table) => [
      uniqueIndex('user_email_idx').on(table.email),
      index('user_role_idx').on(table.role),
    ]
  );
  
  export const session = pgTable(
    'session',
    {
      id: text('id').primaryKey(),
      expiresAt: timestamp('expiresAt').notNull(),
      token: text('token').notNull().unique(),
      createdAt: timestamp('createdAt').notNull().defaultNow(),
      updatedAt: timestamp('updatedAt').notNull().defaultNow(),
      ipAddress: text('ipAddress'),
      userAgent: text('userAgent'),
      userId: text('userId')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    },
    (table) => [index('session_user_id_idx').on(table.userId)]
  );
  
  export const account = pgTable(
    'account',
    {
      id: text('id').primaryKey(),
      accountId: text('accountId').notNull(),
      providerId: text('providerId').notNull(),
      userId: text('userId')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
      accessToken: text('accessToken'),
      refreshToken: text('refreshToken'),
      idToken: text('idToken'),
      accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
      refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
      scope: text('scope'),
      password: text('password'), // For email/password auth
      createdAt: timestamp('createdAt').notNull().defaultNow(),
      updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    },
    (table) => [index('account_user_id_idx').on(table.userId)]
  );
  
  export const verification = pgTable('verification', {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  });

  export const userProfile = pgTable('user_profile', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    location: text('location').notNull(), // City/region in Kansas
    phoneNumber: text('phone_number'),
    isKansasResident: boolean('is_kansas_resident').notNull().default(true),
    currentEmploymentStatus: text('current_employment_status', {
      enum: ['employed', 'unemployed', 'student', 'other']
    }).notNull(),
    currentJobTitle: text('current_job_title'),
    currentIndustry: text('current_industry'),
    yearsOfExperience: integer('years_of_experience'),
    educationLevel: text('education_level', {
      enum: ['high_school', 'some_college', 'associates', 'bachelors', 'masters', 'doctorate', 'other']
    }).notNull(),
    availableHoursPerWeek: integer('available_hours_per_week').notNull(),
    willingToRelocate: boolean('willing_to_relocate').notNull().default(false),
    hasTransportation: boolean('has_transportation').notNull().default(true),
    financialSituation: text('financial_situation', {
      enum: ['can_afford_paid', 'needs_free_only', 'needs_assistance']
    }).notNull(),
    learningPreference: text('learning_preference', {
      enum: ['online', 'in_person', 'hybrid', 'self_paced']
    }).notNull(),
    barriers: text('barriers'), // JSON stringified array
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }, (table) => [
    index('user_profile_user_id_idx').on(table.userId),
  ]);

  export const notificationPreference = pgTable('notification_preference', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: 'cascade' }),
    emailReminders: boolean('email_reminders').notNull().default(true),
    reminderFrequency: text('reminder_frequency', {
      enum: ['daily', 'weekly', 'biweekly']
    }).notNull().default('weekly'),
    milestoneEmails: boolean('milestone_emails').notNull().default(true),
    phaseCompletionEmails: boolean('phase_completion_emails').notNull().default(true),
    marketingEmails: boolean('marketing_emails').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }, (table) => [
    index('notification_preference_user_id_idx').on(table.userId),
  ]);

  export const email = pgTable('email', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    to: text('to').notNull(),
    subject: text('subject').notNull(),
    type: text('type', {
      enum: ['verification', 'password_reset', 'plan_ready', 'reminder', 'milestone_complete', 'phase_complete', 'admin_digest']
    }).notNull(),
    status: text('status', { enum: ['queued', 'sent', 'failed'] }).notNull().default('queued'),
    sentAt: timestamp('sent_at'),
    error: text('error'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }, (table) => [
    index('email_user_id_idx').on(table.userId),
    index('email_type_idx').on(table.type),
    index('email_status_idx').on(table.status),
  ]);

  export const conversation = pgTable('conversation', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    type: text('type', {
      enum: ['intake', 'general', 'plan_refinement']
    }).notNull().default('general'),
    status: text('status', {
      enum: ['active', 'completed', 'archived']
    }).notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }, (table) => [
    index('conversation_user_id_idx').on(table.userId),
    index('conversation_type_idx').on(table.type),
    index('conversation_status_idx').on(table.status),
  ]);

  export const message = pgTable('message', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversation.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['user', 'assistant'] }).notNull(),
    content: text('content').notNull(),
    toolInvocations: text('tool_invocations'), // JSON stringified array of tool calls
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }, (table) => [
    index('message_conversation_id_idx').on(table.conversationId),
    index('message_created_at_idx').on(table.createdAt),
  ]);

  export const plan = pgTable('plan', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    conversationId: text('conversation_id')
      .references(() => conversation.id, { onDelete: 'set null' }),
    targetCareer: text('target_career').notNull(),
    currentCareer: text('current_career'),
    estimatedDuration: text('estimated_duration').notNull(),
    salaryExpectationsEntry: text('salary_expectations_entry'),
    salaryExpectationsExperienced: text('salary_expectations_experienced'),
    jobMarketOutlook: text('job_market_outlook'),
    status: text('status', {
      enum: ['active', 'completed', 'archived']
    }).notNull().default('active'),
    generatedAt: timestamp('generated_at').notNull().defaultNow(),
    lastActivityAt: timestamp('last_activity_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  }, (table) => [
    index('plan_user_id_idx').on(table.userId),
    index('plan_status_idx').on(table.status),
  ]);

  export const phase = pgTable('phase', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    planId: text('plan_id')
      .notNull()
      .references(() => plan.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    estimatedDuration: text('estimated_duration').notNull(),
    orderIndex: integer('order_index').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }, (table) => [
    index('phase_plan_id_idx').on(table.planId),
  ]);

  export const milestone = pgTable('milestone', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    phaseId: text('phase_id')
      .notNull()
      .references(() => phase.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    orderIndex: integer('order_index').notNull(),
    completionCriteria: text('completion_criteria').notNull(),
    verificationRequired: boolean('verification_required').notNull().default(false),
    isCompleted: boolean('is_completed').notNull().default(false),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }, (table) => [
    index('milestone_phase_id_idx').on(table.phaseId),
  ]);

  export const task = pgTable('task', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    milestoneId: text('milestone_id')
      .notNull()
      .references(() => milestone.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    orderIndex: integer('order_index').notNull(),
    isCompleted: boolean('is_completed').notNull().default(false),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }, (table) => [
    index('task_milestone_id_idx').on(table.milestoneId),
  ]);

  export const resource = pgTable('resource', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    milestoneId: text('milestone_id')
      .notNull()
      .references(() => milestone.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    type: text('type', {
      enum: ['course', 'certification', 'program', 'job_listing', 'article', 'video', 'other']
    }).notNull(),
    cost: text('cost').notNull(),
    duration: text('duration'),
    location: text('location', { enum: ['online', 'in_person', 'hybrid'] }),
    provider: text('provider'),
    isAccredited: boolean('is_accredited'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  }, (table) => [
    index('resource_milestone_id_idx').on(table.milestoneId),
  ]);