"use server";

import MailerLite from "@mailerlite/mailerlite-nodejs";
import { eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { emailMarketing } from "@/db/schema";
import { env } from "@/env";
import { createDataAccessError } from "../errors";
import { AddEmailMarketingSubscriberSchema } from "./schemas";

const mailerlite = new MailerLite({
  api_key: env.MAILER_API_KEY,
});

export const addEmailMarketingSubscriber = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: AddEmailMarketingSubscriberSchema,
  callback: async ({ email }) => {
    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(emailMarketing)
      .where(eq(emailMarketing.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return createDataAccessError({
        type: "USER_ALREADY_HAS_SUBSCRIPTION",
        message: "Email is already subscribed to the newsletter",
      });
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
