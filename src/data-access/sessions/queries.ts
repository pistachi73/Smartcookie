"use server";

import {
  addDays,
  differenceInMinutes,
  format,
  lastDayOfWeek,
  startOfWeek,
} from "date-fns";
import { and, asc, between, count, desc, eq, gt, gte, lt } from "drizzle-orm";
import { z } from "zod";

import type { ChartConfig } from "@/shared/components/ui/chart";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { session, sessionNote } from "@/db/schema";
import { getDayKeyFromDateString } from "@/features/calendar/lib/utils";
import { getTimestampISO } from "../utils";
import {
  GetCalendarSessionsByDateRangeSchema,
  GetInfiniteSessionsByHubIdSchema,
  GetSessionsByHubIdSchema,
} from "./schemas";

export const getSessionsByHubId = withProtectedDataAccess({
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

export const getHubOverviewSessions = withProtectedDataAccess({
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

    return [...(pastSession ? [pastSession] : []), ...futureSessions];
  },
});

export const getSessionsCountByHubId = withProtectedDataAccess({
  schema: GetSessionsByHubIdSchema,
  callback: async ({ hubId }, user) => {
    const result = await db
      .select({ count: count() })
      .from(session)
      .where(and(eq(session.hubId, hubId), eq(session.userId, user.id)));

    return result[0]?.count ?? 0;
  },
});

export const getPaginatedSessionsByHubId = withProtectedDataAccess({
  schema: GetInfiniteSessionsByHubIdSchema,
  callback: async ({ hubId, cursor, direction = "next", limit = 10 }, user) => {
    const now = new Date();
    const baseWhere = and(
      eq(session.hubId, hubId),
      eq(session.userId, user.id),
    );

    let whereClause = baseWhere;
    let orderBy: any[];

    if (cursor) {
      if (direction === "next") {
        // Get more future sessions (sessions with startTime > cursor)
        whereClause = and(baseWhere, gt(session.startTime, cursor));
        orderBy = [asc(session.startTime)]; // Future sessions: closest first
      } else {
        // Get past sessions (sessions with startTime < cursor)
        whereClause = and(baseWhere, lt(session.startTime, cursor));
        orderBy = [desc(session.startTime)]; // Past sessions: most recent first
      }
    } else {
      // Initial load: Get both past and future sessions, but return them in the desired display order
      // We'll fetch upcoming sessions first, then past sessions can be loaded via prev button
      whereClause = and(baseWhere, gt(session.startTime, now.toISOString()));
      orderBy = [asc(session.startTime)]; // Upcoming sessions: closest first
    }

    // Fetch limit + 1 to determine if there are more pages
    const rawSessions = await db
      .select({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
      })
      .from(session)
      .where(whereClause)
      .orderBy(...orderBy)
      .limit(limit + 1);

    // Check if there are more pages
    const hasMore = rawSessions.length > limit;
    const sessions = hasMore ? rawSessions.slice(0, limit) : rawSessions;

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

    if (direction === "prev") {
      formattedSessions.reverse();
    }

    // Determine cursors for next/prev pages
    const nextCursor =
      sessions.length > 0
        ? sessions[sessions.length - 1]?.startTime
        : undefined;
    const prevCursor =
      sessions.length > 0
        ? sessions[sessions.length - 1]?.startTime
        : undefined;

    // For initial load, set prevCursor to "now" so past sessions can be loaded
    let finalPrevCursor = prevCursor;
    if (!cursor && direction === "next") {
      finalPrevCursor = now.toISOString();
    }

    return {
      sessions: formattedSessions,
      hasNextPage: direction === "next" ? hasMore : false,
      hasPreviousPage: direction === "prev" ? hasMore : !cursor, // Initial load allows past sessions
      nextCursor,
      prevCursor: finalPrevCursor,
    };
  },
});

export const getCalendarSessionsByDateRange = withProtectedDataAccess({
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

export const getNextSession = withProtectedDataAccess({
  callback: async (user) => {
    const now = new Date();

    const n = await db.query.session.findFirst({
      where: and(
        eq(session.userId, user.id),
        gte(session.startTime, now.toISOString()),
      ),
      columns: {
        id: true,
        startTime: true,
        endTime: true,
        hubId: true,
      },
      orderBy: [asc(session.startTime)],

      with: {
        notes: {
          columns: {
            id: true,
            content: true,
          },
          where: eq(sessionNote.position, "plans"),
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
        hub: {
          columns: {
            id: true,
            name: true,
            description: true,
            color: true,
          },
        },
      },
    });

    if (!n) return null;

    const { attendance, ...rest } = n;
    const formattedNextSession = {
      ...rest,
      students: attendance?.map((a) => a.student),
    };

    return formattedNextSession;
  },
});

export const getWeeklyHours = withProtectedDataAccess({
  schema: z.object({
    date: z.string().datetime(),
  }),
  callback: async ({ date }, user) => {
    const firstDay = startOfWeek(date, { weekStartsOn: 1 });
    const lastDay = lastDayOfWeek(date, { weekStartsOn: 1 });
    lastDay.setHours(23, 59, 59, 999);

    const sessions = await db.query.session.findMany({
      where: and(
        eq(session.userId, user.id),
        gte(session.startTime, firstDay.toISOString()),
        lt(session.startTime, lastDay.toISOString()),
      ),
      columns: {
        startTime: true,
        endTime: true,
      },
      with: {
        hub: {
          columns: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: [asc(session.startTime)],
    });

    type DayHours = {
      day: string;
      [hubName: string]: number | string;
    };

    type SessionsByDay = {
      [key: string]: {
        [hubName: string]: number;
      };
    };

    const sessionsByDay: SessionsByDay = {};

    // Create an array of all days in the week
    let currentDay = new Date(firstDay);
    while (currentDay <= lastDay) {
      const dayKey = getDayKeyFromDateString(
        currentDay.toISOString(),
      ) as string;
      sessionsByDay[dayKey] = {};
      currentDay = addDays(currentDay, 1);
    }

    for (const session of sessions) {
      if (!session.hub?.name) continue;

      const startDate = new Date(session.startTime);
      const endDate = new Date(session.endTime);
      const durationInHours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      const dayKey = getDayKeyFromDateString(session.startTime) as string;
      const hubName = session.hub.name;

      if (!sessionsByDay[dayKey]![hubName]) {
        sessionsByDay[dayKey]![hubName] = 0;
      }

      sessionsByDay[dayKey]![hubName] +=
        Math.round(durationInHours * 100) / 100;
    }

    const formattedData: DayHours[] = Object.entries(sessionsByDay).map(
      ([day, hubs]) => ({
        day: format(day, "dd/MM"),
        ...hubs,
      }),
    );

    // Get unique hubs with their colors
    const uniqueHubs = Array.from(
      new Set(sessions.map((s) => s.hub?.name).filter(Boolean)),
    );
    const hubColors = sessions.reduce<Record<string, string>>(
      (acc, session) => {
        if (session.hub?.name && session.hub?.color && !acc[session.hub.name]) {
          acc[session.hub.name] = session.hub.color;
        }
        return acc;
      },
      {},
    );

    const chartConfig = uniqueHubs.reduce<
      Record<string, { label: string; color: string; colorVariable: string }>
    >((acc, hubName) => {
      if (hubName) {
        acc[hubName] = {
          label: hubName,
          colorVariable: hubColors[hubName] ?? "neutral",
          color: `var(--custom-${hubColors[hubName]}-bg)`,
        };
      }
      return acc;
    }, {}) satisfies ChartConfig;

    let averageHoursPerDay = 0;
    let totalHours = 0;

    for (const day of formattedData) {
      const totalHoursPerDay = Object.entries(day)
        .filter(([key]) => key !== "day")
        .reduce((sum, [_, hours]) => sum + (hours as number), 0);
      totalHours += totalHoursPerDay;
    }

    averageHoursPerDay = totalHours / formattedData.length;

    const result = {
      data: formattedData,
      chartConfig,
      averageHoursPerDay,
      totalHours,
    };

    return result;
  },
});
