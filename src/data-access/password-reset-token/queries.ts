import { eq } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { passwordResetToken } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";

export const getPasswordResetTokenByToken = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: z.object({
    token: z.string(),
  }),
  callback: async ({ token }) => {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });
  },
});

export const getPasswordResetTokenByEmail = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    return await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
  },
});
