import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_TRUST_HOST: z.string().optional(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    RESEND_API_KEY: z.string(),

    // STRIPE
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),

    // MAILER
    MAILER_API_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID: z.string(),
    NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID: z.string(),
    NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID: z.string(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // STRIPE
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID:
      process.env.NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID:
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_BASIC_ANNUAL_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_ANNUAL_PRICE_ID,

    // MAILER
    MAILER_API_KEY: process.env.MAILER_API_KEY,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
