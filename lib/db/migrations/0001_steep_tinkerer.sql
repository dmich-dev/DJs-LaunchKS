CREATE TABLE "email" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"to" text NOT NULL,
	"subject" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"sent_at" timestamp,
	"error" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preference" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email_reminders" boolean DEFAULT true NOT NULL,
	"reminder_frequency" text DEFAULT 'weekly' NOT NULL,
	"milestone_emails" boolean DEFAULT true NOT NULL,
	"phase_completion_emails" boolean DEFAULT true NOT NULL,
	"marketing_emails" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "notification_preference_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"location" text NOT NULL,
	"phone_number" text,
	"is_kansas_resident" boolean DEFAULT true NOT NULL,
	"current_employment_status" text NOT NULL,
	"current_job_title" text,
	"current_industry" text,
	"years_of_experience" integer,
	"education_level" text NOT NULL,
	"available_hours_per_week" integer NOT NULL,
	"willing_to_relocate" boolean DEFAULT false NOT NULL,
	"has_transportation" boolean DEFAULT true NOT NULL,
	"financial_situation" text NOT NULL,
	"learning_preference" text NOT NULL,
	"barriers" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "email" ADD CONSTRAINT "email_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preference" ADD CONSTRAINT "notification_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_user_id_idx" ON "email" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_type_idx" ON "email" USING btree ("type");--> statement-breakpoint
CREATE INDEX "email_status_idx" ON "email" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notification_preference_user_id_idx" ON "notification_preference" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profile_user_id_idx" ON "user_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");