CREATE TYPE "public"."payment_frequency" AS ENUM('one-time', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."time_investment" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."schedule_type" AS ENUM('on-demand', 'recurrent');--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "billing" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" serial NOT NULL,
	"hub_id" serial NOT NULL,
	"cost" integer NOT NULL,
	"billing_type" "payment_frequency" NOT NULL,
	"tentative" boolean DEFAULT true,
	"invoice_sent" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"salt" text NOT NULL,
	"image" text,
	"payment_frequency" "payment_frequency" DEFAULT 'monthly',
	"location" text,
	"nationality" text,
	"age" integer,
	"time_investment" "time_investment" DEFAULT 'medium',
	"job" text,
	"away_until" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" serial NOT NULL,
	"hub_id" serial NOT NULL,
	CONSTRAINT "client_hub_clientId_hubId_unique" UNIQUE("client_id","hub_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"hub_id" integer,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"price" integer,
	"is_recurring" boolean DEFAULT false,
	"recurrence_rule" text,
	"timezone" text DEFAULT 'UTC' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_occurrence" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"overrides" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"schedule_type" "schedule_type" NOT NULL,
	"default_session_price" integer NOT NULL,
	"cancelation_policy_hours" integer NOT NULL
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
 ALTER TABLE "billing" ADD CONSTRAINT "billing_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "client_hub" ADD CONSTRAINT "client_hub_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_hub" ADD CONSTRAINT "client_hub_hub_id_hub_id_fk" FOREIGN KEY ("hub_id") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "hub" ADD CONSTRAINT "hub_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
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
CREATE INDEX IF NOT EXISTS "client_hub_client_id_index" ON "client_hub" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_hub_hub_id_index" ON "client_hub" USING btree ("hub_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "two_factor_confirmation_token_index" ON "two_factor_confirmation" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email_index" ON "user" USING btree ("email");