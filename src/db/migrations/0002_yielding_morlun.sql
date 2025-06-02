ALTER TABLE "survey_template_questions" DROP CONSTRAINT "survey_template_questions_question_id_questions_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "survey_template_questions" ADD CONSTRAINT "survey_template_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
