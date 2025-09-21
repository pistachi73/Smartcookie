CREATE TYPE "public"."quick_note_status" AS ENUM('active', 'inactive');--> statement-breakpoint
ALTER TABLE "quick_note" ADD COLUMN "status" "quick_note_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "quick_note" DROP COLUMN "created_at";