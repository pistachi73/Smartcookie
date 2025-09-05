import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { twoFactorConirmation } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";

export const getTwoFactorConirmationByUserId = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    return await db.query.twoFactorConirmation.findFirst({
      where: eq(twoFactorConirmation.userId, userId),
    });
  },
});
