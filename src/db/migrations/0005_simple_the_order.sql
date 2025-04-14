CREATE TYPE "public"."attendance_status" AS ENUM('present', 'absent');--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_event_id_event_id_fk";
--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "student_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "session_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "status" "attendance_status" DEFAULT 'present' NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendance" ADD CONSTRAINT "attendance_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN IF EXISTS "attendance";--> statement-breakpoint
ALTER TABLE "attendance" DROP COLUMN IF EXISTS "event_id";