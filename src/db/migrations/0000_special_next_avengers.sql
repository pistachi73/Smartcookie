CREATE TYPE "public"."hub_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."custom_color" AS ENUM('flamingo', 'tangerine', 'banana', 'sage', 'peacock', 'blueberry', 'lavender', 'grape', 'graphite', 'neutral', 'sunshine', 'stone', 'slate');--> statement-breakpoint
CREATE TYPE "public"."student_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendance" boolean DEFAULT true,
	"student_id" serial NOT NULL,
	"event_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "billing" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"hub_id" serial NOT NULL,
	"cost" integer NOT NULL,
	"tentative" boolean DEFAULT true,
	"invoice_sent" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"hub_id" integer,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"price" integer,
	"is_recurring" boolean DEFAULT false,
	"recurrence_rule" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"color" text DEFAULT 'blue' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_occurrence" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"overrides" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_participant" (
	"event_occurrence_id" serial NOT NULL,
	"participant_id" serial NOT NULL,
	"attended" boolean DEFAULT false,
	CONSTRAINT "composite_key" PRIMARY KEY("participant_id","event_occurrence_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"schedule" text,
	"status" "hub_status" DEFAULT 'active',
	"color" "custom_color" DEFAULT 'neutral' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"level" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "password_reset_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "password_reset_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quick_note" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"hub_id" integer,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"location" text,
	"nationality" text,
	"job" text,
	"status" "student_status" DEFAULT 'active',
	"birth_date" timestamp with time zone,
	"mother_language" text,
	"learning_language" text,
	"image" text,
	"interests" text,
	"age" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "student_hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" serial NOT NULL,
	"hub_id" serial NOT NULL,
	CONSTRAINT "student_hub_studentId_hubId_unique" UNIQUE("student_id","hub_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_confirmation" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "two_factor_confirmation_userId_token_unique" UNIQUE("user_id","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "two_factor_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "two_factor_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"email_verified" timestamp DEFAULT now(),
	"password" text,
	"salt" text,
	"role" text DEFAULT 'USER',
	"is_two_factor_enabled" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"email" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_token_email_token_unique" UNIQUE("email","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing" ADD CONSTRAINT "billing_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "billing" ADD CONSTRAINT "billing_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event" ADD CONSTRAINT "event_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_occurrence" ADD CONSTRAINT "event_occurrence_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_occurrence_id_event_occurrence_id_fk" FOREIGN KEY ("event_occurrence_id") REFERENCES "public"."event_occurrence"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_participant_id_student_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hub" ADD CONSTRAINT "hub_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quick_note" ADD CONSTRAINT "quick_note_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quick_note" ADD CONSTRAINT "quick_note_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student" ADD CONSTRAINT "student_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_hub" ADD CONSTRAINT "student_hub_student_id_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "student_hub" ADD CONSTRAINT "student_hub_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "two_factor_confirmation" ADD CONSTRAINT "two_factor_confirmation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_participant_participant_id_index" ON "event_participant" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_participant_event_occurrence_id_index" ON "event_participant" USING btree ("event_occurrence_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "hub" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_name_index" ON "student" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_email_index" ON "student" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_search_idx" ON "student" USING gin (to_tsvector('english', "name" || ' ' || "email"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_hub_student_id_index" ON "student_hub" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "student_hub_hub_id_index" ON "student_hub" USING btree ("hub_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "two_factor_confirmation_token_index" ON "two_factor_confirmation" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" USING btree ("email");