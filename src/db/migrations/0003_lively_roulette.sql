CREATE TYPE "public"."subscription_status" AS ENUM('inactive', 'active');--> statement-breakpoint
CREATE TABLE "subscription" (
	"user_id" uuid NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_user_id_stripe_subscription_id_pk" PRIMARY KEY("user_id","stripe_subscription_id"),
	CONSTRAINT "subscription_stripeSubscriptionId_unique" UNIQUE("stripe_subscription_id"),
	CONSTRAINT "subscription_stripeCustomerId_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscription_user_id_index" ON "subscription" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_stripe_subscription_id_index" ON "subscription" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "subscription_stripe_customer_id_index" ON "subscription" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "subscription_status_index" ON "subscription" USING btree ("status");