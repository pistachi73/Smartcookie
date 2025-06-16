ALTER TABLE "quick_note" ALTER COLUMN "content" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "student" ADD CONSTRAINT "student_email_unique" UNIQUE("email");