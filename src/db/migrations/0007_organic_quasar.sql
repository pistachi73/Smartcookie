ALTER TABLE "session_note" ALTER COLUMN "position" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "session_note" ALTER COLUMN "position" SET DEFAULT 'plans'::text;--> statement-breakpoint
DROP TYPE "public"."session_note_position";--> statement-breakpoint
CREATE TYPE "public"."session_note_position" AS ENUM('plans', 'in-class');--> statement-breakpoint
ALTER TABLE "session_note" ALTER COLUMN "position" SET DEFAULT 'plans'::"public"."session_note_position";--> statement-breakpoint
ALTER TABLE "session_note" ALTER COLUMN "position" SET DATA TYPE "public"."session_note_position" USING "position"::"public"."session_note_position";