"use server";

import { db } from "@/db";
import { attendance, hub, session, student } from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { jsonAggregateObjects } from "@/shared/lib/query/json-aggregate-objects";
import { and, between, eq } from "drizzle-orm";
import { GetCalendarSessionsByDateRangeSchema } from "../lib/calendar.schema";
import { groupOverlappingSessions } from "../lib/group-overlapping-sessions";
import { organizeSessionsByDay } from "../lib/organize-sessions-by-day";

export const getCalendarSessionsByDateRangeUseCase = withValidationAndAuth({
  schema: GetCalendarSessionsByDateRangeSchema,
  useCase: async ({ startDate, endDate }, userId) => {
    console.log("startDate", startDate);
    console.log("endDate", endDate);
    const sessions = await db
      .select({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        students: jsonAggregateObjects<
          {
            id: number;
            name: string;
            email: string;
            image: string | null;
          }[]
        >({
          id: student.id,
          name: student.name,
          email: student.email,
          image: student.image,
        }).as("students"),
        hub: {
          id: hub.id,
          name: hub.name,
          color: hub.color,
        },
      })
      .from(session)
      .leftJoin(attendance, eq(attendance.sessionId, session.id))
      .leftJoin(student, eq(attendance.studentId, student.id))
      .leftJoin(hub, eq(session.hubId, hub.id))
      .where(
        and(
          eq(session.userId, userId),
          between(session.startTime, startDate, endDate),
        ),
      )
      .groupBy(session.id, hub.id);

    return organizeSessionsByDay(groupOverlappingSessions(sessions));
  },
});
