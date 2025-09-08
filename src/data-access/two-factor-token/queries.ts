import { eq } from "drizzle-orm";
import { z } from "zod";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";

export const getTwoFactorTokenByEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    return await db.query.twoFactorToken.findFirst({
      where: eq(twoFactorToken.email, email),
    });
  },
});
