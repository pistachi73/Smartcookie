"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { TOKEN_LENGTH } from "@/core/config/app-config";
import { db } from "@/db";
import { passwordResetToken } from "@/db/schema";
import { withValidationOnly } from "../protected-data-access";
import { generateRandomToken } from "../utils";
import { getPasswordResetTokenByEmail } from "./queries";
import {
  CreatePasswordResetTokenSchema,
  DeletePasswordResetTokenByTokenSchema,
} from "./schemas";

export const createPasswordResetToken = withValidationOnly({
  schema: CreatePasswordResetTokenSchema,
  callback: async ({ token, email, expires }) => {
    const [createdToken] = await db
      .insert(passwordResetToken)
      .values({ token, email, expires })
      .returning();
    return createdToken;
  },
});

export const deletePasswordResetTokenByToken = withValidationOnly({
  schema: DeletePasswordResetTokenByTokenSchema,
  callback: async ({ token, trx = db }) => {
    await trx
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.token, token));
  },
});

export const generatePasswordResetToken = withValidationOnly({
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    const token = generateRandomToken(TOKEN_LENGTH);
    const expires = new Date(Date.now() + 3600 * 1000);
    const existingToken = await getPasswordResetTokenByEmail({ email });

    const [createdToken] = await Promise.all([
      createPasswordResetToken({ token, email, expires }),
      existingToken
        ? deletePasswordResetTokenByToken({ token: existingToken.token })
        : Promise.resolve(),
    ]);

    return createdToken;
  },
});
