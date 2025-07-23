"use server";

import { and, between, eq } from "drizzle-orm";

import { withValidationAndAuth } from "@/shared/lib/protected-use-case";

import { db } from "@/db";
import { session } from "@/db/schema";
import { GetCalendarSessionsByDateRangeSchema } from "../lib/calendar.schema";
import { groupOverlappingSessions } from "../lib/group-overlapping-sessions";
import { organizeSessionsByDay } from "../lib/organize-sessions-by-day";

export const getCalendarSessionsByDateRange = async (
  startDate: string,
  endDate: string,
  userId: string,
) => {
  const sess = await db.query.session.findMany({
    where: and(
      eq(session.userId, userId),
      between(session.startTime, startDate, endDate),
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

  const formattedSessions = sess.map((s) => {
    const { attendance, ...rest } = s;
    return {
      ...rest,
      students: attendance.map((a) => a.student),
    };
  });

  return formattedSessions;
};

export const getCalendarSessionsByDateRangeUseCase = withValidationAndAuth({
  schema: GetCalendarSessionsByDateRangeSchema,
  useCase: async ({ startDate, endDate }, user) => {
    const sess = await getCalendarSessionsByDateRange(
      startDate,
      endDate,
      user.id,
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("sess students", sess[0]?.students.length, sess[0]?.students);

    return organizeSessionsByDay(groupOverlappingSessions(sess));
  },
});
