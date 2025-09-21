import type { UserSubscription } from "@/db/schema";

export const createMockUserSubscription = (
  overrides: Partial<UserSubscription> = {},
): UserSubscription => ({
  userId: "user-123",
  stripeSubscriptionId: "sub_123",
  stripeSubscriptionStatus: "active",
  stripePriceId: "price_123",
  status: "active",
  tier: "basic",
  currentPeriodStart: new Date("2024-01-01"),
  currentPeriodEnd: new Date("2024-02-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
});
