import { withValidationOnly } from "@/data-access/protected-data-access";
import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const getTwoFactorTokenByEmail = withValidationOnly({
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    try {
      return await db.query.twoFactorToken.findFirst({
        where: eq(twoFactorToken.email, email),
      });
    } catch {
      return null;
    }
  },
});
