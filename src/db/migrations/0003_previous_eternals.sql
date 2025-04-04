ALTER TABLE "session_note" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "session_note" DROP COLUMN IF EXISTS "order";