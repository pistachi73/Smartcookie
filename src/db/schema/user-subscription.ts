import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "./user";
import { pgTable } from "./utils";

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "inactive",
  "active",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", ["pro"]);

export const userSubscription = pgTable(
  "user_subscription",
  {
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Stripe identifiers
    stripeSubscriptionId: text().notNull().unique(),
    stripePriceId: text().notNull(),

    // Subscription details
    status: subscriptionStatusEnum().notNull().default("active"),
    tier: subscriptionTierEnum().notNull().default("pro"),

    // Important dates
    currentPeriodStart: timestamp({ mode: "date" }).notNull(),
    currentPeriodEnd: timestamp({ mode: "date" }).notNull(),

    // Audit fields
    createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.stripeSubscriptionId],
    }),
    index().on(table.userId),
    index().on(table.stripeSubscriptionId),
    index().on(table.status),
  ],
);

export const userSubscriptionRelations = relations(
  userSubscription,
  ({ one }) => ({
    user: one(user, {
      fields: [userSubscription.userId],
      references: [user.id],
    }),
  }),
);

// Type exports
export type InsertUserSubscription = typeof userSubscription.$inferInsert;
export type UserSubscription = typeof userSubscription.$inferSelect;
export type UserSubscriptionStatus =
  (typeof subscriptionStatusEnum.enumValues)[number];
