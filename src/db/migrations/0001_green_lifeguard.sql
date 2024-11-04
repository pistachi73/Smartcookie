CREATE TABLE IF NOT EXISTS "client_hub" (
	"id" serial PRIMARY KEY NOT NULL,
	"clientId" serial NOT NULL,
	"hubId" serial NOT NULL,
	CONSTRAINT "client_hub_clientId_hubId_unique" UNIQUE("clientId","hubId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_hub" ADD CONSTRAINT "client_hub_clientId_client_id_fk" FOREIGN KEY ("clientId") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_hub" ADD CONSTRAINT "client_hub_hubId_hub_id_fk" FOREIGN KEY ("hubId") REFERENCES "public"."hub"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_hub_clientId_index" ON "client_hub" USING btree ("clientId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "client_hub_hubId_index" ON "client_hub" USING btree ("hubId");