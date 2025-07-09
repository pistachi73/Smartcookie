import { db } from "@/db";
import { userSubscription } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withValidationOnly } from "../protected-data-access";
import { createColumnSelectionSchema } from "../shared-schemas";

export const getUserSubscriptionByUserId = withValidationOnly({
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
