import { eq } from "drizzle-orm";

import { db } from "@/db";
import { account } from "@/db/schema";
import z from "zod";
import { withValidationOnly } from "./protected-data-access";

export const getAccountByUserId = withValidationOnly({
  schema: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    return await db.query.account.findFirst({
      where: eq(account.userId, userId),
    });
  },
});
