import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { isDataAccessError } from "@/data-access/errors";
import {
  downgradePlan,
  upgradePlan,
} from "@/data-access/plan-management/queries";
import { db } from "@/db";
import { type SubscriptionTier, userSubscription } from "@/db/schema";
import { env } from "@/env";

type Metadata = {
  userId: string;
};

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

/**
 * Get numeric tier level for comparison
 */
const getTierLevel = (tier: SubscriptionTier | "free"): number => {
  const tierLevels: Record<SubscriptionTier | "free", number> = {
    free: 0,
    basic: 1,
    premium: 2,
  };
  return tierLevels[tier];
};

/**
 * Log data access errors with specific handling based on error type
 *
 * Provides detailed, actionable error messages for different failure scenarios:
 * - User-related errors (not found, unauthorized)
 * - Plan transition errors (invalid, wrong direction)
 * - Resource management errors (archiving, restoration)
 * - System errors (validation, authentication, unexpected)
 * - Limit errors (resource limits exceeded)
 *
 * Each error type includes:
 * - Clear error message with operation context
 * - Specific debugging suggestions
 * - Relevant metadata when available
 */
const logDataAccessError = (
  logPrefix: string,
  operation: "upgrade" | "downgrade",
  error: { type: string; message: string; meta?: any },
) => {
  const operationEmoji = operation === "upgrade" ? "📈" : "📉";

  switch (error.type) {
    case "USER_NOT_FOUND":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} User not found:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check if user ID exists in database`);
      break;

    case "INVALID_PLAN_TRANSITION":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Invalid plan transition:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check tier values:`, error.meta);
      break;

    case "NOT_AN_UPGRADE":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Not an upgrade:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Use downgradePlan for downgrades`);
      break;

    case "NOT_A_DOWNGRADE":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Not a downgrade:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Use upgradePlan for upgrades`);
      break;

    case "UPGRADE_FAILED":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Upgrade operation failed:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check resource restoration logic`);
      break;

    case "DOWNGRADE_FAILED":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Downgrade operation failed:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check resource archiving logic`);
      break;

    case "ARCHIVE_FAILED":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Resource archiving failed:`,
        error.message,
      );
      console.error(
        `${logPrefix} 🔍 Check database connection and resource status`,
      );
      break;

    case "UNARCHIVE_FAILED":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Resource restoration failed:`,
        error.message,
      );
      console.error(
        `${logPrefix} 🔍 Check archived resources and database constraints`,
      );
      break;

    case "INVALID_RESOURCE_TYPE":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Invalid resource type:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check resource type parameter`);
      break;

    case "UNAUTHORIZED":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Unauthorized access:`,
        error.message,
      );
      console.error(
        `${logPrefix} 🔍 Check user permissions and authentication`,
      );
      break;

    case "VALIDATION_ERROR":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Validation failed:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check input data:`, error.meta);
      break;

    case "AUTHENTICATION_ERROR":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Authentication failed:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Check user authentication status`);
      break;

    case "UNEXPECTED_ERROR":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Unexpected system error:`,
        error.message,
      );
      console.error(
        `${logPrefix} 🔍 Check system logs and database connectivity`,
      );
      break;

    case "LIMIT_EXCEEDED_STUDENTS":
    case "LIMIT_REACHED_SESSIONS":
    case "LIMIT_REACHED_NOTES":
    case "LIMIT_REACHED_HUBS":
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Resource limit exceeded:`,
        error.message,
      );
      console.error(
        `${logPrefix} 🔍 Check plan limits and current resource usage`,
      );
      break;

    default:
      console.error(
        `${logPrefix} ❌ ${operationEmoji} Unknown error:`,
        error.message,
      );
      console.error(`${logPrefix} 🔍 Error type: ${error.type}`, error.meta);
      break;
  }
};

const webhookHandler = async (req: NextRequest) => {
  let event: Stripe.Event | undefined;

  console.log("🔑 Webhook secret:", webhookSecret);

  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.log(`❌ Webhook signature verification failed: ${errorMessage}`);

      return NextResponse.json(
        {
          error: {
            message: `Webhook Error: ${errorMessage}`,
          },
        },
        { status: 400 },
      );
    }

    console.log(`✅ Processing webhook event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        try {
          const session = event.data.object as Stripe.Checkout.Session & {
            metadata: Metadata;
          };

          if (!session.subscription) {
            console.log("⚠️ No subscription found in checkout session");
            break;
          }

          if (!session.metadata?.userId) {
            console.log("⚠️ No userId found in session metadata");
            break;
          }

          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );

          const subscriptionItem = subscription.items.data[0];
          if (!subscriptionItem) {
            console.log("⚠️ No subscription item found");
            break;
          }

          const userId = session.metadata.userId;
          const priceId = subscriptionItem.price.id;
          const currentPeriodEnd = new Date(
            subscriptionItem.current_period_end * 1000,
          );
          const currentPeriodStart = new Date(
            subscriptionItem.current_period_start * 1000,
          );

          // Check if subscription already exists (handle duplicates)
          const existingSubscription = await db
            .select()
            .from(userSubscription)
            .where(eq(userSubscription.stripeSubscriptionId, subscription.id))
            .limit(1);

          if (existingSubscription.length > 0) {
            console.log(
              `⚠️ Subscription ${subscription.id} already exists, skipping insert`,
            );
            break;
          }

          const tier =
            priceId === env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID ||
            priceId === env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID
              ? "premium"
              : "basic";

          await db.insert(userSubscription).values({
            userId: userId,
            stripeSubscriptionId: subscription.id,
            stripeSubscriptionStatus: subscription.status,
            stripePriceId: priceId,
            currentPeriodEnd,
            currentPeriodStart,
            status: "active",
            tier,
          });

          // Upgrade user to their new subscription tier
          try {
            await upgradeUser({ userId, fromTier: "free", toTier: tier });
          } catch (upgradeError) {
            console.error(
              `❌ Failed to upgrade user ${userId} after checkout:`,
              upgradeError,
            );
            console.error(
              `🔍 Webhook context: New subscription created for tier ${tier}`,
            );
            // Continue - subscription record was created successfully
          }

          console.log(`✅ Created subscription for user ${userId}`);
        } catch (error) {
          console.error(
            "❌ Error processing checkout.session.completed:",
            error,
          );
          throw error;
        }
        break;
      }

      case "customer.subscription.updated": {
        try {
          const subscription = event.data.object as Stripe.Subscription;
          const subscriptionItem = subscription.items.data[0];

          if (!subscriptionItem) {
            console.log("⚠️ No subscription item found in updated subscription");
            break;
          }

          const priceId = subscriptionItem.price.id;
          const stripeSubscriptionId = subscription.id;
          const currentPeriodEnd = new Date(
            subscriptionItem.current_period_end * 1000,
          );
          const currentPeriodStart = new Date(
            subscriptionItem.current_period_start * 1000,
          );
          const status = ["active", "trialing"].includes(subscription.status)
            ? "active"
            : "inactive";

          const tier =
            priceId === env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID ||
            priceId === env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID
              ? "premium"
              : "basic";

          // Get the existing subscription to check if tier changed
          const existingSubscription = await db
            .select({
              userId: userSubscription.userId,
              status: userSubscription.status,
              tier: userSubscription.tier,
            })
            .from(userSubscription)
            .where(
              eq(userSubscription.stripeSubscriptionId, stripeSubscriptionId),
            )
            .limit(1);

          // Update using WHERE clause
          await db
            .update(userSubscription)
            .set({
              stripeSubscriptionStatus: subscription.status,
              stripePriceId: priceId,
              currentPeriodEnd,
              currentPeriodStart,
              status,
              tier,
            })
            .where(
              eq(userSubscription.stripeSubscriptionId, stripeSubscriptionId),
            );

          // If subscription was cancelled or downgraded, enforce limits
          if (existingSubscription.length > 0) {
            const existingRecord = existingSubscription[0];
            if (existingRecord) {
              const oldTier = existingRecord.tier;
              const userId = existingRecord.userId;

              const isTierUpgrade =
                status === "active" &&
                getTierLevel(tier) > getTierLevel(oldTier);
              const isTierDowngrade =
                status === "active" &&
                getTierLevel(tier) < getTierLevel(oldTier);

              try {
                if (isTierUpgrade) {
                  await upgradeUser({
                    userId,
                    fromTier: oldTier,
                    toTier: tier,
                  });
                } else if (isTierDowngrade) {
                  await downgradeUser({
                    userId,
                    fromTier: oldTier,
                    toTier: tier,
                  });
                } else {
                  console.log(
                    `ℹ️ No plan change needed for user ${userId}: ${oldTier} → ${tier} (status: ${existingRecord.status} → ${status})`,
                  );
                }
              } catch (planChangeError) {
                console.error(
                  `❌ Failed to process plan change for user ${userId}:`,
                  planChangeError,
                );
                console.error(
                  `🔍 Webhook context: ${oldTier} → ${tier}, status: ${existingRecord.status} → ${status}`,
                );
                // Don't throw - we still want to update the subscription record
              }
            }
          }

          console.log(
            `✅ Updated subscription ${stripeSubscriptionId} with status ${status}`,
          );
        } catch (error) {
          console.error(
            "❌ Error processing customer.subscription.updated:",
            error,
          );
          throw error;
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook handler error:", error);
    console.error("Event type:", event?.type || "unknown");

    return NextResponse.json(
      {
        error: {
          message: "Internal server error",
        },
      },
      { status: 500 },
    );
  }
};

/**
 * Upgrade user plan and restore archived resources
 */
const upgradeUser = async ({
  userId,
  fromTier,
  toTier,
}: {
  userId: string;
  fromTier: "free" | SubscriptionTier;
  toTier: SubscriptionTier;
}) => {
  const logPrefix = `[UPGRADE ${userId}]`;

  try {
    console.log(`${logPrefix} 🔄 Starting upgrade to ${toTier}`);

    const result = await upgradePlan({
      userId,
      fromTier,
      toTier,
    });

    if (isDataAccessError(result)) {
      logDataAccessError(logPrefix, "upgrade", result);
      throw new Error(`Plan upgrade failed: ${result.message}`);
    }

    // Log success with resource restoration details
    const { restored } = result.resourceChanges;
    const totalRestored =
      restored.hubs.unarchived +
      restored.students.unarchived +
      restored.notes.unarchived;

    console.log(`${logPrefix} ✅ Upgrade completed successfully`);

    if (totalRestored > 0) {
      console.log(
        `${logPrefix} 📊 Resources restored: ${totalRestored} total`,
        {
          hubs: restored.hubs.unarchived,
          students: restored.students.unarchived,
          quickNotes: restored.notes.unarchived,
        },
      );
    } else {
      console.log(`${logPrefix} 📊 No archived resources to restore`);
    }
  } catch (error) {
    console.error(`${logPrefix} ❌ Upgrade failed:`, error);
    throw error;
  }
};

/**
 * Downgrade user plan and archive excess resources
 */
const downgradeUser = async ({
  userId,
  fromTier,
  toTier,
}: {
  userId: string;
  fromTier: "free" | SubscriptionTier;
  toTier: "free" | SubscriptionTier;
}) => {
  const logPrefix = `[DOWNGRADE ${userId}]`;

  try {
    console.log(`${logPrefix} ⬇️ Starting downgrade to ${toTier}`);

    const result = await downgradePlan({
      userId,
      fromTier,
      toTier,
    });

    if (isDataAccessError(result)) {
      logDataAccessError(logPrefix, "downgrade", result);
      throw new Error(`Plan downgrade failed: ${result.message}`);
    }

    // Log success with archiving details
    const { archived } = result.resourceChanges;
    const totalArchived =
      archived.hubs.archived +
      archived.students.archived +
      archived.notes.archived;

    console.log(`${logPrefix} ✅ Downgrade completed successfully`);

    // Show warnings if any resources were archived
    if (result.warnings.length > 0) {
      console.log(`${logPrefix} ⚠️ Resource changes:`);
      result.warnings.forEach((warning) =>
        console.log(`${logPrefix}   - ${warning}`),
      );
    }

    if (totalArchived > 0) {
      console.log(
        `${logPrefix} 📊 Resources archived: ${totalArchived} total`,
        {
          hubs: archived.hubs.archived,
          students: archived.students.archived,
          quickNotes: archived.notes.archived,
        },
      );
    } else {
      console.log(`${logPrefix} 📊 No resources needed archiving`);
    }
  } catch (error) {
    console.error(`${logPrefix} ❌ Downgrade failed:`, error);
    throw error;
  }
};

export { webhookHandler as POST };
