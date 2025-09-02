"use server";

import MailerLite from "@mailerlite/mailerlite-nodejs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { emailMarketing } from "@/db/schema";
import { env } from "@/env";
import { createDataAccessError } from "../errors";
import { withValidationOnly } from "../protected-data-access";
import { AddEmailMarketingSubscriberSchema } from "./schemas";

const mailerlite = new MailerLite({
  api_key: env.MAILER_API_KEY,
});

export const addEmailMarketingSubscriber = withValidationOnly({
  schema: AddEmailMarketingSubscriberSchema,
  callback: async ({ email }) => {
    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(emailMarketing)
      .where(eq(emailMarketing.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return createDataAccessError("USER_ALREADY_HAS_SUBSCRIPTION");
    }

    await Promise.all([
      db.insert(emailMarketing).values({
        email,
      }),

      mailerlite.subscribers.createOrUpdate({
        email,
      }),
    ]);

    return true;
  },
});
