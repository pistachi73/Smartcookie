DROP INDEX "session_status_idx";--> statement-breakpoint
CREATE INDEX "session_user_start_time_idx" ON "session" USING btree ("user_id","start_time");