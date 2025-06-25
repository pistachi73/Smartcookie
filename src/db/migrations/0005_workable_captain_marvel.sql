CREATE TABLE IF NOT EXISTS "email_marketing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "survey_responses" DROP CONSTRAINT "survey_responses_survey_id_survey_id_fk";
--> statement-breakpoint
ALTER TABLE "survey_responses" ALTER COLUMN "survey_id" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_marketing_email_index" ON "email_marketing" USING btree ("email");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_responses" ADD CONSTRAINT "survey_responses_survey_id_survey_id_fk" FOREIGN KEY ("survey_id") REFERENCES "public"."survey"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
