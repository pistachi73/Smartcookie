"use server";

import { db } from "@/db";
import { session } from "@/db/schema";
import type { GetHubSessionsUseCaseSchema } from "@/features/hub/lib/schemas";
import { differenceInMinutes } from "date-fns";
import { and, asc, eq } from "drizzle-orm";
import type { z } from "zod";

export const getHubSessions = async ({
  hubId,
  userId,
}: z.infer<typeof GetHubSessionsUseCaseSchema>) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const sessions = await db
    .select({
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      status: session.status,
    })
    .from(session)
    .where(and(eq(session.hubId, hubId), eq(session.userId, userId)))
    .orderBy(asc(session.startTime))
    .groupBy(session.id);

  const sessionsWithDuration = sessions.map((session) => {
    const endTime = new Date(session.endTime);
    const startTime = new Date(session.startTime);
    const totalMinutes = differenceInMinutes(endTime, startTime);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      ...session,
      startTime,
      endTime,
      duration: {
        hours,
        minutes,
        totalMinutes,
      },
    };
  });

  return sessionsWithDuration;
};
