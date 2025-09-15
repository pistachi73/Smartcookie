export const PRICING_FREQUENCY = {
  MONTHLY: "M",
  YEARLY: "A",
} as const;

export const PRICING_PLANS_PRICES = {
  free: {
    monthly: 0,
    yearly: 0,
  },
  pro: {
    monthly: 10,
    yearly: 8,
  },
  premium: {
    monthly: 20,
    yearly: 16,
  },
} as const;
