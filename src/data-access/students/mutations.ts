"use server";

import { and, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { session, student, studentHub } from "@/db/schema";
import {
  addAttendance,
  removeAllStudentAttendance,
} from "../attendance/mutations";
import { createDataAccessError } from "../errors";
import { archiveStudentSurveyResponsesInHub } from "../survey-response/mutations";
import {
  AddStudentSchema,
  AddStudentToHubSchema,
  CreateStudentInHubSchema,
  DeleteStudentSchema,
  RemoveStudentFromHubSchema,
  UpdateStudentSchema,
} from "./schemas";

export const addStudent = withProtectedDataAccess({
  schema: AddStudentSchema,
  callback: async (data, user) => {
    const [createdStudent] = await db
      .insert(student)
      .values({
        ...data,
        userId: user.id,
      })
      .returning();

    return createdStudent;
  },
});

export const addStudentToHub = withProtectedDataAccess({
  schema: AddStudentToHubSchema,
  callback: async ({ studentId, hubId }) => {
    await db.transaction(async (trx) => {
      const sessions = await trx
        .select({ id: session.id })
        .from(session)
        .where(eq(session.hubId, hubId));

      await Promise.all([
        trx.insert(studentHub).values({
          studentId,
          hubId,
        }),
        addAttendance({
          data: {
            sessionIds: sessions.map((session) => session.id),
            studentIds: [studentId],
            hubId,
          },
          trx,
        }),
      ]);
    });
  },
});

export const removeStudentFromHub = withProtectedDataAccess({
  schema: RemoveStudentFromHubSchema,
  callback: async ({ studentId, hubId }) => {
    await db.transaction(async (trx) => {
      await Promise.all([
        trx
          .delete(studentHub)
          .where(
            and(
              eq(studentHub.studentId, studentId),
              eq(studentHub.hubId, hubId),
            ),
          ),
        removeAllStudentAttendance({
          data: { studentId, hubId },
          trx,
        }),
        archiveStudentSurveyResponsesInHub({
          studentId,
          hubId,
          trx,
        }),
      ]);
    });

    return { success: true };
  },
});

export const createStudentInHub = withProtectedDataAccess({
  schema: CreateStudentInHubSchema,
  callback: async ({ student: studentData, hubId }, user) => {
    // Check for existing student first to avoid unnecessary transaction
    const existingStudent = await db
      .select({ id: student.id })
      .from(student)
      .where(
        and(eq(student.email, studentData.email), eq(student.userId, user.id)),
      )
      .limit(1);

    if (existingStudent.length > 0) {
      return {
        success: false,
        message: "Student with this email already exists",
        data: null,
      };
    }

    let createdStudentId: number;

    await db.transaction(async (trx) => {
      // Parallel fetch of sessions while creating student
      const [createdStudents, sessions] = await Promise.all([
        trx
          .insert(student)
          .values({ ...studentData, userId: user.id })
          .returning({ id: student.id }),
        trx
          .select({ id: session.id })
          .from(session)
          .where(eq(session.hubId, hubId)),
      ]);

      const createdStudent = createdStudents[0];
      if (!createdStudent) {
        throw new Error("Failed to create student");
      }

      createdStudentId = createdStudent.id;

      // Parallel execution of student-hub association and attendance creation
      await Promise.all([
        trx.insert(studentHub).values({
          studentId: createdStudent.id,
          hubId,
        }),
        sessions.length > 0
          ? addAttendance({
              data: {
                sessionIds: sessions.map((session) => session.id),
                studentIds: [createdStudent.id],
                hubId,
              },
              trx,
            })
          : Promise.resolve(),
      ]);
    });

    return {
      success: true,
      message: "Student created successfully",
      data: { studentId: createdStudentId! },
    };
  },
});

export const deleteStudent = withProtectedDataAccess({
  schema: DeleteStudentSchema,
  callback: async ({ studentId }, user) => {
    await db
      .delete(student)
      .where(and(eq(student.id, studentId), eq(student.userId, user.id)));
  },
});

export const updateStudent = withProtectedDataAccess({
  schema: UpdateStudentSchema,
  callback: async ({ id, ...studentData }, user) => {
    const [updatedStudent] = await db
      .update(student)
      .set(studentData)
      .where(and(eq(student.id, id), eq(student.userId, user.id)))
      .returning();

    if (!updatedStudent) {
      return createDataAccessError({
        type: "NOT_FOUND",
        message: "Student not found",
      });
    }

    return updatedStudent;
  },
});
