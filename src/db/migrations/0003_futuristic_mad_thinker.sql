ALTER TABLE "questions" ADD COLUMN "total_answers" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "answers" DROP COLUMN IF EXISTS "total_answer_count";