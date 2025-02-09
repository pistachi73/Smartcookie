ALTER TABLE "event" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event_occurrence" ADD COLUMN "timezone" text DEFAULT 'UTC' NOT NULL;