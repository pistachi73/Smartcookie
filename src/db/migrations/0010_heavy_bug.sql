ALTER TABLE "user_subscription" ALTER COLUMN "tier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_subscription" ALTER COLUMN "tier" SET DEFAULT 'basic'::text;--> statement-breakpoint
DROP TYPE "public"."subscription_tier";--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('basic', 'premium');--> statement-breakpoint
ALTER TABLE "user_subscription" ALTER COLUMN "tier" SET DEFAULT 'basic'::"public"."subscription_tier";--> statement-breakpoint
ALTER TABLE "user_subscription" ALTER COLUMN "tier" SET DATA TYPE "public"."subscription_tier" USING "tier"::"public"."subscription_tier";--> statement-breakpoint
ALTER TABLE "quick_note" ALTER COLUMN "content" SET DATA TYPE text;