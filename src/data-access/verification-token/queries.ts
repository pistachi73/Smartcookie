import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { verificationToken } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";

export const getVerificationTokenByTokenAndEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    token: z.string(),
    email: z.string().email(),
  }),
  callback: async ({ token, email }) => {
    return await db.query.verificationToken.findFirst({
      where: and(
        eq(verificationToken.token, token),
        eq(verificationToken.email, email),
      ),
    });
  },
});

export const getVerificationTokenByEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    return await db.query.verificationToken.findFirst({
      where: eq(verificationToken.email, email),
    });
  },
});
