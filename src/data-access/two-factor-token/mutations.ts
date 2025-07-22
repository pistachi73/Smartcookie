"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { sendTwoFactorTokenEmail } from "@/shared/lib/mail";

import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";
import { createDataAccessError } from "../errors";
import { withValidationOnly } from "../protected-data-access";
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

export const deleteTwoFactorTokenByToken = withValidationOnly({
  schema: z.object({
    token: z.string(),
  }),
  callback: async (data) => {
    await db.delete(twoFactorToken).where(eq(twoFactorToken.token, data.token));
  },
});

export const sendTwoFactorEmail = withValidationOnly({
  schema: SendTwoFactorTokenEmailSchema,
  callback: async (data) => {
    const twoFactorToken = await generateTwoFactorToken(data.email);
    try {
      await sendTwoFactorTokenEmail({
        token: twoFactorToken.token,
        email: data.email,
      });
    } catch (_e) {
      return createDataAccessError("EMAIL_SENDING_FAILED");
    }

    return true;
  },
});
