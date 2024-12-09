import { db } from "@/db";
import { session } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getHubSessionsWithExceptions = async (hubId: number) => {
  const sessions = await db.query.session.findMany({
    where: eq(session.hubId, hubId),
    with: {
      exceptions: {},
    },
  });

  return sessions;
};

// export const getHubSessionsWithExceptionsSql = async (hubId: number) => {

//   const sessions = await db.select().from(session).where(eq(session.hubId, hubId)).leftJoin(sessionException, (sessionException.sessionId, session.id)).selectAll();

//   const sessions = await db.query.session.findMany({
//     where: eq(session.hubId, hubId),
//     with: {
//       exceptions: {},
//     },
//   });

//   return sessions;
// };
