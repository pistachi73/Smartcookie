import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { twoFactorToken } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";

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
