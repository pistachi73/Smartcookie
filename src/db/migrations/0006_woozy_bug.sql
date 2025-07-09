CREATE TYPE "public"."subscription_tier" AS ENUM('pro');--> statement-breakpoint
ALTER TABLE "user_subscription" ADD COLUMN "tier" "subscription_tier" DEFAULT 'pro' NOT NULL;