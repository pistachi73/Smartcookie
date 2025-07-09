import { z } from "zod";

export const createStripeCustomerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  userId: z.string().min(1),
});

export const createCheckoutSessionSchema = z.object({
  paymentFrequency: z.enum(["M", "A"]),
});
