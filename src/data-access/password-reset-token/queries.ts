import { eq } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { passwordResetToken } from "@/db/schema";
import { withValidationOnly } from "../protected-data-access";

export const getPasswordResetTokenByToken = withValidationOnly({
  schema: z.object({
    token: z.string(),
  }),
  callback: async ({ token }) => {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
  },
});

export const getPasswordResetTokenByEmail = withValidationOnly({
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
  },
});
