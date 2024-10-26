import { eq } from "drizzle-orm";

import { db } from "@/db";
import { account } from "@/db/schema";

export const getAccountByUserId = async (userId: string) => {
  return await db.query.account.findFirst({
    where: eq(account.userId, userId),
  });
};
