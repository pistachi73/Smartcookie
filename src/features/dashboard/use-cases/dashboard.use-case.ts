"use server";

import { addDays, lastDayOfWeek, startOfWeek } from "date-fns";
import { and, asc, eq, gte, lt, sql } from "drizzle-orm";
import { z } from "zod";

import type { ChartConfig } from "@/shared/components/ui/chart";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "@/shared/lib/protected-use-case";

import { db } from "@/db";
import { session, sessionNote } from "@/db/schema";
import { organizeSessionsByDay } from "@/features/calendar/lib/organize-sessions-by-day";
import { getDayKeyFromDateString } from "@/features/calendar/lib/utils";

export const getNextSessionUseCase = withAuthenticationNoInput({
  useCase: async (user) => {
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
      extras: {
        totalSessions: sql<number>`(
          SELECT COUNT(*) 
          FROM ${session} s
          WHERE s.user_id = ${user.id}
            AND s.hub_id = ${session.hubId}
            AND s.status != 'cancelled'
        )`
          .mapWith(Number)
          .as("totalSessions"),
        cancelledSessions: sql<number>`(
          SELECT COUNT(*) 
          FROM ${session} s
          WHERE s.user_id = ${user.id}
            AND s.hub_id = ${session.hubId}
            AND s.status = 'cancelled'
        )`
          .mapWith(Number)
          .as("cancelledSessions"),
        completedSessions: sql<number>`(
          SELECT COUNT(*) 
          FROM ${session} s
          WHERE s.user_id = ${user.id}
            AND s.hub_id = ${session.hubId}
            AND s.status = 'completed'
        )`
          .mapWith(Number)
          .as("completedSessions"),
      },
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

    console.log(n?.startTime);

    if (!n) return null;

    const { attendance, ...rest } = n;
    const formattedNextSession = {
      ...rest,
      students: attendance?.map((a) => a.student),
      totalSessions: n?.totalSessions ?? 0,
      completedSessions: n?.completedSessions ?? 0,
    };

    return formattedNextSession;
  },
});

export const getAgendaSessionsUseCase = withValidationAndAuth({
  schema: z.object({
    dateInterval: z.tuple([z.string().datetime(), z.string().datetime()]),
  }),
  useCase: async ({ dateInterval }, user) => {
    const startDate = new Date(dateInterval[0]);
    const endDate = new Date(dateInterval[1]);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const sessions = await db.query.session.findMany({
      where: and(
        eq(session.userId, user.id),
        gte(session.startTime, startDate.toISOString()),
        lt(session.endTime, endDate.toISOString()),
      ),
      columns: {
        id: true,
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
              columns: { id: true, name: true },
            },
          },
        },
      },
      orderBy: [asc(session.startTime)],
    });

    const formattedSessions = sessions.map((s) => ({
      ...s,
      students: s.attendance?.map((a) => a.student),
    }));

    console.log({ formattedSessions }, Boolean(formattedSessions));

    const byDaySessions = organizeSessionsByDay(formattedSessions);

    return byDaySessions;
  },
});

export const getWeeklyHoursUseCase = withValidationAndAuth({
  schema: z.object({
    date: z.string().datetime(),
  }),
  useCase: async ({ date }, user) => {
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

      sessionsByDay[dayKey]![hubName] += durationInHours;
    }

    const formattedData: DayHours[] = Object.entries(sessionsByDay).map(
      ([day, hubs]) => ({
        day,
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
          color: hubColors[hubName] ?? "neutral",
          colorVariable: `var(--color-custom-${hubColors[hubName]}-bg)`,
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
