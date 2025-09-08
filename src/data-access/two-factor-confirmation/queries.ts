import { eq } from "drizzle-orm";
import { z } from "zod";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { twoFactorConirmation } from "@/db/schema";

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
