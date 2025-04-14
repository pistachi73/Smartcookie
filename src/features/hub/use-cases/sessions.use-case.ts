"use server";

import { db } from "@/db";
import { type InsertSession, hub, session } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { differenceInMinutes, endOfDay, startOfDay } from "date-fns";
import { and, asc, between, eq, inArray, notInArray } from "drizzle-orm";
import {
  findOverlappingIntervals,
  hasOverlappingIntervals,
} from "../lib/find-overlapping-sessions";
import {
  AddSessionsUseCaseSchema,
  CheckSessionConflictsUseCaseSchema,
  DeleteSessionsUseCaseSchema,
  GetSessionsByHubIdUseCaseSchema,
  UpdateSessionUseCaseSchema,
} from "../lib/sessions.schema";

export const getSessionsByHubIdUseCase = withValidationAndAuth({
  schema: GetSessionsByHubIdUseCaseSchema,
  useCase: async (data, userId) => {
    const { hubId } = data;
    const sessions = await db
      .select({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
      })
      .from(session)
      .where(and(eq(session.hubId, hubId), eq(session.userId, userId)))
      .orderBy(asc(session.startTime));

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
  },
});

export const addSessionsUseCase = withValidationAndAuth({
  schema: AddSessionsUseCaseSchema,
  useCase: async (data, userId) => {
    const { sessions, hubId } = data;

    const toAddSessions: InsertSession[] = sessions.map((s) => ({
      ...s,
      userId,
      hubId,
    }));

    const addedSessions = await db
      .insert(session)
      .values(toAddSessions)
      .returning();

    if (!addedSessions.length) {
      throw new Error("Failed to add sessions");
    }

    return true;
  },
});

export const checkSessionConflictsUseCase = withValidationAndAuth({
  schema: CheckSessionConflictsUseCaseSchema,
  useCase: async (data, userId) => {
    const { sessions, excludedSessionIds } = data;

    // First check if the new sessions overlap with each other
    const newSessionIntervals = sessions.map((s) => [
      new Date(s.startTime).getTime(),
      new Date(s.endTime).getTime(),
    ]) as [number, number][];

    // Check if the new sessions overlap with each other first.
    // This should never happen
    if (hasOverlappingIntervals(newSessionIntervals)) {
      return {
        success: false,
        overlappingSessions: [],
      };
    }

    const uniqueDates = new Set<Date>();
    for (const s of sessions) {
      if (s.startTime) {
        const date = new Date(s.startTime);
        date.setHours(0, 0, 0, 0); // Normalize to start of day
        uniqueDates.add(date);
      }
    }

    const existingSessionArrays = await Promise.all(
      Array.from(uniqueDates).map(async (date) => {
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        return db
          .select({
            startTime: session.startTime,
            endTime: session.endTime,
            hubName: hub.name,
          })
          .from(session)
          .leftJoin(hub, eq(session.hubId, hub.id))
          .where(
            and(
              eq(session.userId, userId),
              between(
                session.startTime,
                dayStart.toISOString(),
                dayEnd.toISOString(),
              ),
              excludedSessionIds
                ? notInArray(session.id, excludedSessionIds)
                : undefined,
            ),
          );
      }),
    );

    // Flatten the array of arrays into a single array
    const existingSessions = existingSessionArrays.flat();

    // Early return if no existing sessions
    if (existingSessions.length === 0) {
      return {
        success: true,
        overlappingSessions: [],
      };
    }

    const existingSessionIntervals = existingSessions.map((s) => [
      new Date(s.startTime).getTime(),
      new Date(s.endTime).getTime(),
    ]) as [number, number][];

    // Check if new sessions overlap with existing ones
    const overlappingSessionIndexes = findOverlappingIntervals([
      ...newSessionIntervals,
      ...existingSessionIntervals,
    ]);

    if (overlappingSessionIndexes.length) {
      type OverlappingSession = {
        startTime: string;
        endTime: string;
        hubName?: string;
      };
      const overlappingSessions = overlappingSessionIndexes.map(
        ([startIndex, endIndex]) => {
          const startSession =
            startIndex < sessions.length
              ? sessions[startIndex]
              : existingSessions[startIndex - sessions.length];
          const endSession =
            endIndex < sessions.length
              ? sessions[endIndex]
              : existingSessions[endIndex - sessions.length];
          return {
            s1: startSession,
            s2: endSession,
          };
        },
      ) as { s1: OverlappingSession; s2: OverlappingSession }[];

      return {
        success: false,
        overlappingSessions,
      };
    }

    return {
      success: true,
      overlappingSessions: [],
    };
  },
});

export const updateSessionUseCase = withValidationAndAuth({
  schema: UpdateSessionUseCaseSchema,
  useCase: async (data, userId) => {
    const { sessionId, data: updateData } = data;

    const updatedSession = await db
      .update(session)
      .set({
        startTime: updateData.startTime,
        endTime: updateData.endTime,
        status: updateData.status,
      })
      .where(and(eq(session.id, sessionId), eq(session.userId, userId)))
      .returning();

    if (!updatedSession.length) {
      throw new Error("Session not found or unauthorized");
    }

    return updatedSession[0];
  },
});

export const deleteSessionUseCase = withValidationAndAuth({
  schema: DeleteSessionsUseCaseSchema,
  useCase: async (data, userId) => {
    const deletedSession = await db
      .delete(session)
      .where(
        and(inArray(session.id, data.sessionIds), eq(session.userId, userId)),
      )
      .returning();

    if (!deletedSession.length) {
      throw new Error("Session not found or unauthorized");
    }

    return true;
  },
});
