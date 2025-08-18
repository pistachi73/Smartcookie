"use server";

import { differenceInMinutes } from "date-fns";
import { and, asc, between, count, desc, eq, gt, lt } from "drizzle-orm";

import { db } from "@/db";
import { session, sessionNote } from "@/db/schema";
import { withValidationAndAuth } from "../protected-data-access";
import { getTimestampISO, parseRequiredDateWithTimezone } from "../utils";
import {
  GetCalendarSessionsByDateRangeSchema,
  GetInfiniteSessionsByHubIdSchema,
  GetSessionsByHubIdSchema,
} from "./schemas";

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

export const getHubOverviewSessions = withValidationAndAuth({
  schema: GetSessionsByHubIdSchema,
  callback: async ({ hubId }, user) => {
    const now = new Date();

    // Single optimized query using Promise.all for parallel execution
    const [futureSessions, pastSession] = await Promise.all([
      // Future sessions (3 most recent)
      db.query.session.findMany({
        where: and(
          eq(session.hubId, hubId),
          eq(session.userId, user.id),
          gt(session.endTime, now.toISOString()),
        ),
        columns: {
          id: true,
          status: true,
        },
        extras: {
          startTime: getTimestampISO(session.startTime, "startTime"),
          endTime: getTimestampISO(session.endTime, "endTime"),
        },

        orderBy: [asc(session.startTime)],
        limit: 3,
        with: {
          notes: {
            columns: {
              id: true,
              content: true,
              position: true,
            },
            where: eq(sessionNote.position, "plans"),
          },
        },
      }),
      // Past sessions (1 most recent)
      db.query.session.findFirst({
        where: and(
          eq(session.hubId, hubId),
          eq(session.userId, user.id),
          lt(session.endTime, now.toISOString()),
        ),
        columns: {
          id: true,
          status: true,
        },
        extras: {
          startTime: getTimestampISO(session.startTime, "startTime"),
          endTime: getTimestampISO(session.endTime, "endTime"),
        },
        orderBy: [desc(session.startTime)],
        with: {
          notes: {
            columns: {
              id: true,
              content: true,
              position: true,
            },
            where: eq(sessionNote.position, "in-class"),
          },
        },
      }),
    ]);

    console.log(pastSession);

    return [...(pastSession ? [pastSession] : []), ...futureSessions];
  },
});

export const getSessionsCountByHubId = withValidationAndAuth({
  schema: GetSessionsByHubIdSchema,
  callback: async ({ hubId }, user) => {
    const result = await db
      .select({ count: count() })
      .from(session)
      .where(and(eq(session.hubId, hubId), eq(session.userId, user.id)));

    return result[0]?.count ?? 0;
  },
});

export const getPaginatedSessionsByHubId = withValidationAndAuth({
  schema: GetInfiniteSessionsByHubIdSchema,
  callback: async ({ hubId, cursor, direction = "next", limit = 10 }, user) => {
    console.log({ cursor, hubId, direction, limit });

    const baseWhere = and(
      eq(session.hubId, hubId),
      eq(session.userId, user.id),
    );

    let whereClause = baseWhere;
    let orderBy = [asc(session.startTime)]; // Default: newest first

    // Handle cursor-based pagination
    if (cursor) {
      if (direction === "next") {
        console.log("next", cursor);
        // Get older sessions (cursor < startTime)
        whereClause = and(baseWhere, gt(session.startTime, cursor));
      } else {
        // Get newer sessions (cursor > startTime)
        whereClause = and(baseWhere, lt(session.startTime, cursor));
        orderBy = [desc(session.startTime)]; // For prev, we need ascending order
      }
    } else {
      const now = new Date();
      whereClause = and(baseWhere, gt(session.startTime, now.toISOString()));
    }

    // Fetch limit + 1 to determine if there are more pages
    const rawSessions = await db
      .select({
        id: session.id,
        startTime: parseRequiredDateWithTimezone(
          session.startTime,
          "startTime",
        ),
        endTime: parseRequiredDateWithTimezone(session.endTime, "endTime"),
        status: session.status,
      })
      .from(session)
      .where(whereClause)
      .orderBy(...orderBy)
      .limit(limit + 1);

    // Check if there are more pages
    const hasMore = rawSessions.length > limit;
    const sessions = hasMore ? rawSessions.slice(0, limit) : rawSessions;

    // If we fetched in ascending order (prev direction), reverse to maintain newest-first
    if (direction === "prev") {
      sessions.reverse();
    }

    // Format sessions with duration calculation
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

    // Determine cursors for next/prev pages
    const nextCursor = sessions[sessions.length - 1]?.startTime;
    const prevCursor = sessions[0]?.startTime;

    console.log({ nextCursor, prevCursor });

    return {
      sessions: formattedSessions,
      hasNextPage: direction === "next" ? hasMore : false,
      hasPreviousPage: direction === "prev" ? hasMore : false,
      nextCursor,
      prevCursor,
    };
  },
});

export const getCalendarSessionsByDateRange = withValidationAndAuth({
  schema: GetCalendarSessionsByDateRangeSchema,
  callback: async ({ startDate, endDate }, user) => {
    const sessions = await db.query.session.findMany({
      where: and(
        eq(session.userId, user.id),
        between(session.startTime, startDate, endDate),
      ),
      columns: {
        id: true,
        status: true,
        startTime: true,
        endTime: true,
      },
      with: {
        hub: {
          columns: {
            id: true,
            name: true,
            color: true,
          },
        },
        attendance: {
          columns: {},
          with: {
            student: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const formattedSessions = sessions.map((s) => {
      const { attendance, ...rest } = s;
      return {
        ...rest,
        students: attendance.map((a) => a.student),
      };
    });

    return formattedSessions;
  },
});
