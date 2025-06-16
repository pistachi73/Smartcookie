CREATE TYPE "public"."survey_response_status" AS ENUM('active', 'archived', 'deleted');--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "question_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" ALTER COLUMN "survey_response_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "hub" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "survey" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "survey_responses" ADD COLUMN "status" "survey_response_status" DEFAULT 'active' NOT NULL;