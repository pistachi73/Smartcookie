"use server";

import { endOfDay, startOfDay } from "date-fns";
import { and, between, eq, inArray, notInArray } from "drizzle-orm";

import { db } from "@/db";
import { hub, type InsertSession, session, studentHub } from "@/db/schema";
import { addAttendance } from "../attendance/mutations";
import { withValidationAndAuth } from "../protected-data-access";
import {
  AddSessionsSchema,
  CheckSessionConflictsSchema,
  DeleteSessionsSchema,
  UpdateSessionSchema,
} from "./schemas";
import { findOverlappingIntervals, hasOverlappingIntervals } from "./utils";

export const addSessions = withValidationAndAuth({
  schema: AddSessionsSchema,
  callback: async ({ sessions, hubId, trx = db }, user) => {
    return await trx.transaction(async (trx) => {
      const toAddSessions: InsertSession[] = sessions.map((s) => ({
        ...s,
        userId: user.id,
        hubId,
      }));

      const [addedSessions, hubStudents] = await Promise.all([
        trx.insert(session).values(toAddSessions).returning({
          id: session.id,
        }),
        trx
          .select({
            studentId: studentHub.studentId,
          })
          .from(studentHub)
          .where(eq(studentHub.hubId, hubId)),
      ]);

      if (!addedSessions.length) {
        throw new Error("Failed to add sessions");
      }

      await addAttendance({
        data: {
          sessionIds: addedSessions.map((s) => s.id),
          studentIds: hubStudents.map((hs) => hs.studentId),
          hubId,
        },
        trx,
      });
      return addedSessions;
    });
  },
});

export const checkSessionConflicts = withValidationAndAuth({
  schema: CheckSessionConflictsSchema,
  callback: async (data, user) => {
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
              eq(session.userId, user.id),
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

    console.log(newSessionIntervals, existingSessionIntervals);

    // Check if new sessions overlap with existing ones
    const allIntervals = [...newSessionIntervals, ...existingSessionIntervals];
    const overlappingSessionIndexes = findOverlappingIntervals(
      allIntervals,
    ).filter(
      ([i1, i2]) =>
        (i1 < sessions.length && i2 >= sessions.length) ||
        (i2 < sessions.length && i1 >= sessions.length),
    );

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

      console.log(overlappingSessions);

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

export const updateSession = withValidationAndAuth({
  schema: UpdateSessionSchema,
  callback: async (data, user) => {
    const { sessionId, data: updateData } = data;

    const updatedSessions = await db
      .update(session)
      .set({
        startTime: updateData.startTime,
        endTime: updateData.endTime,
        status: updateData.status,
      })
      .where(and(eq(session.id, sessionId), eq(session.userId, user.id)))
      .returning({
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
      });

    return updatedSessions[0];
  },
});

export const deleteSession = withValidationAndAuth({
  schema: DeleteSessionsSchema,
  callback: async (data, user) => {
    await db
      .delete(session)
      .where(
        and(inArray(session.id, data.sessionIds), eq(session.userId, user.id)),
      );

    return { success: true };
  },
});
