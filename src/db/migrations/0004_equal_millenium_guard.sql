ALTER TABLE "subscription" RENAME TO "user_subscription";--> statement-breakpoint
ALTER TABLE "user_subscription" DROP CONSTRAINT "subscription_stripeSubscriptionId_unique";--> statement-breakpoint
ALTER TABLE "user_subscription" DROP CONSTRAINT "subscription_stripeCustomerId_unique";--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_stripeSubscriptionId_unique";--> statement-breakpoint
ALTER TABLE "user_subscription" DROP CONSTRAINT "subscription_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "subscription_user_id_index";--> statement-breakpoint
DROP INDEX "subscription_stripe_subscription_id_index";--> statement-breakpoint
DROP INDEX "subscription_stripe_customer_id_index";--> statement-breakpoint
DROP INDEX "subscription_status_index";--> statement-breakpoint
ALTER TABLE "user_subscription" DROP CONSTRAINT "subscription_user_id_stripe_subscription_id_pk";--> statement-breakpoint
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_user_id_stripe_subscription_id_pk" PRIMARY KEY("user_id","stripe_subscription_id");--> statement-breakpoint
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_subscription_user_id_index" ON "user_subscription" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_subscription_stripe_subscription_id_index" ON "user_subscription" USING btree ("stripe_subscription_id");--> statement-breakpoint
CREATE INDEX "user_subscription_stripe_customer_id_index" ON "user_subscription" USING btree ("stripe_customer_id");--> statement-breakpoint
CREATE INDEX "user_subscription_status_index" ON "user_subscription" USING btree ("status");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "stripe_subscription_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "stripe_subscription_ends_on";--> statement-breakpoint
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_stripeSubscriptionId_unique" UNIQUE("stripe_subscription_id");--> statement-breakpoint
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_stripeCustomerId_unique" UNIQUE("stripe_customer_id");