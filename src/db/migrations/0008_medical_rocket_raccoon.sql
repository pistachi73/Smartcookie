CREATE INDEX "session_hub_user_start_idx" ON "session" USING btree ("hub_id","user_id","start_time");--> statement-breakpoint
CREATE INDEX "session_status_idx" ON "session" USING btree ("status");