"use server";

import { differenceInMinutes } from "date-fns";
import { and, asc, between, count, desc, eq, gt, lt } from "drizzle-orm";

import { db } from "@/db";
import { session, sessionNote } from "@/db/schema";
import { withValidationAndAuth } from "../protected-data-access";
import { getTimestampISO } from "../utils";
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

const getInitialInfiniteSessionsByHubId = async (
  hubId: number,
  userId: string,
) => {
  const now = new Date();

  const lowerLimit = 1;
  const upperLimit = 4;

  // Single optimized query using Promise.all for parallel execution
  const [futureSessions, pastSession] = await Promise.all([
    // Future sessions (3 most recent)
    db.query.session.findMany({
      where: and(
        eq(session.hubId, hubId),
        eq(session.userId, userId),
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
      limit: upperLimit + 1,
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
    db.query.session.findMany({
      where: and(
        eq(session.hubId, hubId),
        eq(session.userId, userId),
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
      limit: lowerLimit + 1,
    }),
  ]);

  const hasMore = futureSessions.length > upperLimit;
  const hasLess = pastSession.length > lowerLimit;

  const prevSessions = hasLess ? pastSession.slice(0, 1) : pastSession;
  const nextSessions = hasMore ? futureSessions.slice(0, 1) : futureSessions;

  return {
    sessions: [...prevSessions, ...nextSessions],
    hasMore,
    hasLess,
  };
};

export const getInfiniteSessionsByHubId = withValidationAndAuth({
  schema: GetInfiniteSessionsByHubIdSchema,
  callback: async ({ hubId, cursor, direction, limit }, user) => {
    const baseWhere = and(
      eq(session.hubId, hubId),
      eq(session.userId, user.id),
    );

    console.log({ cursor, direction, limit });

    let whereClause = baseWhere;

    if (!cursor) {
      const { sessions, hasMore, hasLess } =
        await getInitialInfiniteSessionsByHubId(hubId, user.id);

      return {
        sessions,
        hasNext: hasMore,
        hasPrev: hasLess,
        nextCursor:
          hasMore && sessions.length > 0
            ? sessions[sessions.length - 1]!.endTime
            : undefined,
        prevCursor:
          hasLess && sessions.length > 0 ? sessions[0]!.endTime : undefined,
      };
    }

    if (direction === "next") {
      whereClause = and(baseWhere, gt(session.endTime, cursor.toISOString()));
    } else {
      whereClause = and(baseWhere, lt(session.endTime, cursor.toISOString()));
    }

    const sessions = await db.query.session.findMany({
      where: whereClause,
      columns: {
        id: true,
        status: true,
      },
      extras: {
        startTime: getTimestampISO(session.startTime, "startTime"),
        endTime: getTimestampISO(session.endTime, "endTime"),
      },
      orderBy: [
        direction === "next" ? desc(session.endTime) : asc(session.endTime),
      ],
      with: {
        notes: {
          columns: {
            id: true,
            content: true,
            position: true,
          },
          where: eq(
            sessionNote.position,
            direction === "next" ? "plans" : "in-class",
          ),
        },
      },
      limit: limit + 1,
    });

    console.log("sessions", sessions);

    const hasMore = sessions.length > limit;
    const items = hasMore ? sessions.slice(0, limit) : sessions;

    const formattedSessions = items.map((sessionItem) => {
      const endTime = new Date(sessionItem.endTime);
      const startTime = new Date(sessionItem.startTime);
      const totalMinutes = differenceInMinutes(endTime, startTime);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return {
        ...sessionItem,
        duration: {
          hours,
          minutes,
          totalMinutes,
        },
      };
    });

    return {
      sessions: formattedSessions,
      hasNext: direction === "next" ? hasMore : false,
      hasPrev: direction === "prev" ? hasMore : false,
      nextCursor:
        hasMore && items.length > 0
          ? items[items.length - 1]!.endTime
          : undefined,
      prevCursor: items.length > 0 ? items[0]!.endTime : undefined,
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
