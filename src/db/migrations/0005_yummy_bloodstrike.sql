CREATE TABLE IF NOT EXISTS "attendance" (
	"id" serial PRIMARY KEY NOT NULL,
	"attendance" boolean DEFAULT true,
	"client_id" serial NOT NULL,
	"event_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_participant" (
	"event_occurrence_id" serial NOT NULL,
	"participant_id" serial NOT NULL,
	"attended" boolean DEFAULT false,
	CONSTRAINT "composite_key" PRIMARY KEY("participant_id","event_occurrence_id")
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
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_occurrence_id_event_occurrence_id_fk" FOREIGN KEY ("event_occurrence_id") REFERENCES "public"."event_occurrence"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_participant_id_client_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
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
CREATE INDEX IF NOT EXISTS "event_participant_participant_id_index" ON "event_participant" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "event_participant_event_occurrence_id_index" ON "event_participant" USING btree ("event_occurrence_id");--> statement-breakpoint
ALTER TABLE "event_occurrence" DROP COLUMN IF EXISTS "timezone";