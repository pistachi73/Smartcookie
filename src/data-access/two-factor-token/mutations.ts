"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { sendTwoFactorTokenEmail } from "@/shared/lib/mail";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";
import { createDataAccessError } from "../errors";
import { generateSecureRandomInt } from "../utils";
import { getTwoFactorTokenByEmail } from "./queries";
import { SendTwoFactorTokenEmailSchema } from "./schemas";

export const generateTwoFactorToken = async (email: string) => {
  const token = generateSecureRandomInt();
  const expires = new Date(Date.now() + 5 * 60 * 1000);
  const existingToken = await getTwoFactorTokenByEmail({ email });

  if (existingToken) {
    await deleteTwoFactorTokenByToken({ token: existingToken.token });
  }

  const data = { token, email, expires };
  await db.insert(twoFactorToken).values(data);
  return data;
};

export const deleteTwoFactorTokenByToken = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    token: z.string(),
  }),
  callback: async (data) => {
    await db.delete(twoFactorToken).where(eq(twoFactorToken.token, data.token));
  },
});

export const sendTwoFactorEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: SendTwoFactorTokenEmailSchema,
  callback: async (data) => {
    const twoFactorToken = await generateTwoFactorToken(data.email);
    try {
      await sendTwoFactorTokenEmail({
        token: twoFactorToken.token,
        email: data.email,
      });
    } catch (_e) {
      return createDataAccessError({
        type: "EMAIL_SENDING_FAILED",
        message: "Failed to send two-factor authentication email",
      });
    }

    return true;
  },
});
