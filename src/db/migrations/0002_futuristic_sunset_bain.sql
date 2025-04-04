CREATE TYPE "public"."session_status" AS ENUM('upcoming', 'completed');--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "status" "session_status" DEFAULT 'upcoming' NOT NULL;