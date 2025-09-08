import { eq } from "drizzle-orm";
import { z } from "zod";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { userSubscription } from "@/db/schema";
import { createColumnSelectionSchema } from "../shared-schemas";

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
