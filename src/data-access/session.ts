import { db } from "@/db";
import { session } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getHubSessionsWithExceptions = async (hubId: number) => {
  const sessions = await db.query.session.findMany({
    where: eq(session.hubId, hubId),
    with: {
      exceptions: true,
    },
  });

  return sessions;
};
