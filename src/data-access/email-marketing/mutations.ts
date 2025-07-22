"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { emailMarketing } from "@/db/schema";
import { withValidationOnly } from "../protected-data-access";
import { CreateEmailMarketingSchema } from "./schemas";

export const createEmailMarketing = withValidationOnly({
  schema: CreateEmailMarketingSchema,
  callback: async ({ email }) => {
    // Check if email already exists
    const existingEmail = await db
      .select()
      .from(emailMarketing)
      .where(eq(emailMarketing.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return {
        success: false,
        message: "Thanks for your interest! We'll be in touch soon.",
      };
    }

    const _newEmail = await db
      .insert(emailMarketing)
      .values({
        email,
      })
      .returning();

    return {
      success: true,
      message: "Thanks! We'll be in touch soon.",
    };
  },
});
