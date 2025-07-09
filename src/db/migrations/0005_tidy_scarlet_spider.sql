ALTER TABLE "user_subscription" DROP CONSTRAINT "user_subscription_stripeCustomerId_unique";--> statement-breakpoint
DROP INDEX "user_subscription_stripe_customer_id_index";--> statement-breakpoint
ALTER TABLE "user_subscription" DROP COLUMN "stripe_customer_id";