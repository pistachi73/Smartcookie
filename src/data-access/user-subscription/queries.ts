import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { userSubscription } from "@/db/schema";
import { createColumnSelectionSchema } from "../shared-schemas";
import { withProtectedDataAccess } from "../with-protected-data-access";

export const getUserSubscriptionByUserId = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: z.object({
    userId: z.string(),
    columns: createColumnSelectionSchema(userSubscription).optional(),
  }),
  callback: async ({ userId, columns }) => {
    return await db.query.userSubscription.findFirst({
      where: eq(userSubscription.userId, userId),
      columns,
    });
  },
});
