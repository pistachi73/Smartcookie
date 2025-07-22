"use server";

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { attendance, session, student, studentHub } from "@/db/schema";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "../protected-data-access";
import { GetStudentsByHubIdSchema } from "./schemas";

export const getStudentsByHubId = withValidationAndAuth({
  schema: GetStudentsByHubIdSchema,
  callback: async ({ hubId }) => {
    const hubStudents = await db
      .select({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        completedSessions:
          sql<number>`count(case when ${session.status} = 'completed' then ${attendance.id} end)`.as(
            "completedSessions",
          ),
        presentSessions:
          sql<number>`count(case when ${session.status} = 'completed' and ${attendance.status} = 'present' then 1 end)`.as(
            "presentSessions",
          ),
      })
      .from(student)
      .leftJoin(studentHub, eq(studentHub.studentId, student.id))
      .leftJoin(attendance, eq(student.id, attendance.studentId))
      .leftJoin(
        session,
        and(eq(attendance.sessionId, session.id), eq(session.hubId, hubId)),
      )
      .where(eq(studentHub.hubId, hubId))
      .groupBy(student.id, student.name);

    return hubStudents;
  },
});

export const getStudentsByUserId = withAuthenticationNoInput({
  callback: async (user) => {
    const students = await db
      .select({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
      })
      .from(student)
      .where(eq(student.userId, user.id));
    return students;
  },
});
