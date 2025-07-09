ALTER TABLE "user" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_subscription_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "stripe_subscription_ends_on" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_stripeCustomerId_unique" UNIQUE("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_stripeSubscriptionId_unique" UNIQUE("stripe_subscription_id");