"use server";

import { db } from "@/db";

import {
  addAttendance,
  removeStudentAttendance,
} from "@/data-access/attendance.data-access";
import { getSessionsByHubId } from "@/data-access/sessions.data-access";
import {
  addStudentToHub,
  createStudent,
  removeStudentFromHub,
} from "@/data-access/student.data-acces";
import { createTransaction } from "@/data-access/utils";
import { attendance, session, student, studentHub } from "@/db/schema";
import {
  withAuthenticationNoInput,
  withValidationAndAuth,
} from "@/shared/lib/protected-use-case";
import { and, eq, sql } from "drizzle-orm";
import {
  AddStudentToHuUseCaseSchema,
  CreateStudentInHubUseCaseSchema,
  GetStudentsByHubIdSchema,
  RemoveStudentFromHubUseCaseSchema,
} from "../lib/students.schema";

export const getStudentsByHubIdUseCase = withValidationAndAuth({
  schema: GetStudentsByHubIdSchema,
  useCase: async ({ hubId }) => {
    console.log("getStudentsByHubIdUseCase");
    console.log({ hubId });
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

export const getStudentsByUserIdUseCase = withAuthenticationNoInput({
  useCase: async (userId) => {
    const students = await db
      .select({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
      })
      .from(student)
      .where(eq(student.userId, userId));
    return students;
  },
});

export const createStudentInHubUseCase = withValidationAndAuth({
  schema: CreateStudentInHubUseCaseSchema,
  useCase: async ({ formData, hubId }, userId) => {
    await createTransaction(async (trx) => {
      const [createdStudent, sessions] = await Promise.all([
        createStudent({ ...formData, userId }, trx),
        getSessionsByHubId(hubId, { id: session.id }, trx),
      ]);

      if (!createdStudent) {
        throw new Error("Failed to create student");
      }

      await Promise.all([
        addStudentToHub({ studentId: createdStudent.id, hubId }, trx),
        addAttendance(
          {
            sessionIds: sessions.map((session) => session.id),
            studentIds: [createdStudent.id],
            hubId,
          },
          trx,
        ),
      ]);
    });
  },
});

export const addStudentToHubUseCase = withValidationAndAuth({
  schema: AddStudentToHuUseCaseSchema,
  useCase: async ({ studentId, hubId }) => {
    await createTransaction(async (trx) => {
      const sessions = await getSessionsByHubId(hubId, { id: session.id }, trx);
      await Promise.all([
        addStudentToHub({ studentId, hubId }, trx),
        addAttendance(
          {
            sessionIds: sessions.map((session) => session.id),
            studentIds: [studentId],
            hubId,
          },
          trx,
        ),
      ]);
    });
  },
});

export const removeStudentFromHubUseCase = withValidationAndAuth({
  schema: RemoveStudentFromHubUseCaseSchema,
  useCase: async ({ studentId, hubId }) => {
    await createTransaction(async (trx) => {
      await Promise.all([
        removeStudentFromHub({ studentId, hubId }, trx),
        removeStudentAttendance({ studentId, hubId }, trx),
      ]);
    });

    return { success: true };
  },
});
