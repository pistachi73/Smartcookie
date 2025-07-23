import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { userSubscription } from "@/db/schema";
import { env } from "@/env";

type Metadata = {
  userId: string;
};

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

const webhookSecret: string = env.STRIPE_WEBHOOK_SECRET;

const webhookHandler = async (req: NextRequest) => {
  let event: Stripe.Event | undefined;

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

          await db.insert(userSubscription).values({
            userId: userId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            currentPeriodEnd,
            currentPeriodStart,
            status: "active",
          });

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

          // Update using WHERE clause
          const _updateResult = await db
            .update(userSubscription)
            .set({
              stripePriceId: priceId,
              currentPeriodEnd,
              currentPeriodStart,
              status,
            })
            .where(
              eq(userSubscription.stripeSubscriptionId, stripeSubscriptionId),
            );

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

export { webhookHandler as POST };
