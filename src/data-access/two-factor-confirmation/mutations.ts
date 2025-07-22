"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { TOKEN_LENGTH } from "@/core/config/app-config";
import { db } from "@/db";
import { twoFactorConirmation } from "@/db/schema";
import { withValidationOnly } from "../protected-data-access";
import { generateRandomToken } from "../utils";

export const getTwoFactorConfirmationByUserId = withValidationOnly({
  schema: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    return await db.query.twoFactorConirmation.findFirst({
      where: eq(twoFactorConirmation.userId, userId),
    });
  },
});

export const deleteTwoFactorConfirmationByToken = withValidationOnly({
  schema: z.object({
    token: z.string(),
  }),
  callback: async ({ token }) => {
    await db
      .delete(twoFactorConirmation)
      .where(eq(twoFactorConirmation.token, token));
  },
});

export const generateTwoFactorConfirmation = withValidationOnly({
  schema: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    const token = generateRandomToken(TOKEN_LENGTH);
    const existingToken = await getTwoFactorConfirmationByUserId({ userId });

    const [createdTwoFactorConfirmation] = await Promise.all([
      db
        .insert(twoFactorConirmation)
        .values({
          token,
          userId,
        })
        .returning(),
      existingToken
        ? db
            .delete(twoFactorConirmation)
            .where(eq(twoFactorConirmation.token, existingToken.token))
        : Promise.resolve(),
    ]);

    return createdTwoFactorConfirmation[0];
  },
});
