"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { sendVerificationEmail } from "@/shared/lib/mail";

import { db } from "@/db";
import { verificationToken } from "@/db/schema";
import { createDataAccessError } from "../errors";
import { generateSecureRandomInt } from "../utils";
import { withProtectedDataAccess } from "../with-protected-data-access";
import { getVerificationTokenByEmail } from "./queries";
import { SendEmailVerificationEmailSchema } from "./schemas";

export const generateVerificationToken = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    const token = generateSecureRandomInt();
    const expires = new Date(Date.now() + 5 * 60 * 1000);
    const existingToken = await getVerificationTokenByEmail({ email });

    const data = {
      token,
      email,
      expires,
    };

    await Promise.all([
      existingToken
        ? db.delete(verificationToken).where(eq(verificationToken.email, email))
        : Promise.resolve(),
      db.insert(verificationToken).values(data).returning(),
    ]);

    return data;
  },
});

export const sendEmailVerificationEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: SendEmailVerificationEmailSchema,
  callback: async ({ email }) => {
    const response = await generateVerificationToken({ email });

    try {
      await sendVerificationEmail({
        email: response.email,
        token: response.token,
      });
    } catch (_e) {
      return createDataAccessError({
        type: "EMAIL_SENDING_FAILED",
        message: "Failed to send email verification",
      });
    }

    return true;
  },
});
