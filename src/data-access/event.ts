import { db } from "@/db";
import { event } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getEventsByUserId = async (userId: string) => {
  return await db.query.event.findMany({
    where: eq(event.userId, userId),
    with: {
      occurrences: true,
    },
  });
};
