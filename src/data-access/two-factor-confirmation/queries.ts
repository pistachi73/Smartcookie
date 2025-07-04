import { db } from "@/db";
import { twoFactorConirmation } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withValidationOnly } from "../protected-data-access";

export const getTwoFactorConirmationByUserId = withValidationOnly({
  schema: z.object({
    userId: z.string(),
  }),
  callback: async ({ userId }) => {
    return await db.query.twoFactorConirmation.findFirst({
      where: eq(twoFactorConirmation.userId, userId),
    });
  },
});
