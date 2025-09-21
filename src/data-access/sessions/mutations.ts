"use server";

import { endOfDay, startOfDay } from "date-fns";
import { and, between, eq, inArray, notInArray } from "drizzle-orm";

import { sideEffects } from "@/core/side-effects";
import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { hub, type InsertSession, session, studentHub } from "@/db/schema";
import { addAttendance } from "../attendance/mutations";
import { authenticatedDataAccess } from "../data-access-chain";
import { createDataAccessError } from "../errors";
import { sessionLimitMiddleware } from "../limit-middleware";
import {
  AddSessionsSchema,
  CheckSessionConflictsSchema,
  DeleteSessionsSchema,
  UpdateSessionSchema,
} from "./schemas";
import { findOverlappingIntervals, hasOverlappingIntervals } from "./utils";

export const addSessions = authenticatedDataAccess()
  .input(AddSessionsSchema)
  .onError({
    message: "Failed to add sessions",
  })
  .use(sessionLimitMiddleware)
  .execute(async ({ sessions, hubId }, user) => {
    const res = await db.transaction(async (trx) => {
      const toAddSessions: InsertSession[] = sessions.map((s) => ({
        ...s,
        userId: user.id,
        hubId,
      }));

      const [addedSessions, hubStudents] = await Promise.all([
        trx.insert(session).values(toAddSessions).returning({
          id: session.id,
          startTime: session.startTime,
          endTime: session.endTime,
          status: session.status,
        }),
        trx
          .select({
            studentId: studentHub.studentId,
          })
          .from(studentHub)
          .where(eq(studentHub.hubId, hubId)),
      ]);

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

    sideEffects.enqueue("updateHubLastActivity", { hubId, userid: user.id });
    return res;
  });

export const checkSessionConflicts = withProtectedDataAccess({
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

export const updateSession = withProtectedDataAccess({
  schema: UpdateSessionSchema,
  callback: async (data, user) => {
    const { sessionId, data: updateData } = data;

    const [updatedSession] = await db
      .update(session)
      .set({
        startTime: updateData.startTime,
        endTime: updateData.endTime,
        status: updateData.status,
      })
      .where(and(eq(session.id, sessionId), eq(session.userId, user.id)))
      .returning({
        hubId: session.hubId,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
      });

    if (!updatedSession) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Failed to update session",
      });
    }

    sideEffects.enqueue("updateHubLastActivity", {
      hubId: updatedSession.hubId,
      userid: user.id,
    });

    return updatedSession;
  },
});

export const deleteSession = withProtectedDataAccess({
  schema: DeleteSessionsSchema,
  callback: async (data, user) => {
    const [deletedSession] = await db
      .delete(session)
      .where(
        and(
          inArray(
            session.id,
            data.sessions.map((s) => s.id),
          ),
          eq(session.userId, user.id),
        ),
      )
      .returning({
        hubId: session.hubId,
      });

    if (!deletedSession) {
      return createDataAccessError({
        type: "UNEXPECTED_ERROR",
        message: "Failed to delete session",
      });
    }

    sideEffects.enqueue("updateHubLastActivity", {
      hubId: deletedSession.hubId,
      userid: user.id,
    });

    return deletedSession;
  },
});
