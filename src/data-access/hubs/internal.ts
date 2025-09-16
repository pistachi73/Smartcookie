import { count, eq } from "drizzle-orm";

import { db } from "@/db";
import { hub } from "@/db/schema";

export const getUserHubCountInternal = async (userId: string) => {
  const result = await db
    .select({ count: count() })
    .from(hub)
    .where(eq(hub.userId, userId));

  return result[0]?.count || 0;
};
