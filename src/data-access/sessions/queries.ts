"use server";

import { db } from "@/db";
import { session } from "@/db/schema";
import { differenceInMinutes } from "date-fns";
import { and, asc, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import { getTimestampISO } from "../utils";
import { GetSessionsByHubIdSchema } from "./schemas";

export const getSessionsByHubId = withValidationAndAuth({
  schema: GetSessionsByHubIdSchema,
  callback: async ({ hubId }, user) => {
    const sessions = await db
      .select({
        id: session.id,
        startTime: getTimestampISO(session.startTime, "startTime"),
        endTime: getTimestampISO(session.endTime, "endTime"),
        status: session.status,
      })
      .from(session)
      .where(and(eq(session.hubId, hubId), eq(session.userId, user.id)))
      .orderBy(asc(session.startTime));

    const formattedSessions = sessions.map((session) => {
      const endTime = new Date(session.endTime);
      const startTime = new Date(session.startTime);
      const totalMinutes = differenceInMinutes(endTime, startTime);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        ...session,
        duration: {
          hours,
          minutes,
          totalMinutes,
        },
      };
    });

    return formattedSessions;
  },
});
