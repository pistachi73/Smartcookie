"use server";

import { and, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { session, student, studentHub } from "@/db/schema";
import {
  addAttendance,
  removeAllStudentAttendance,
} from "../attendance/mutations";
import { authenticatedDataAccess } from "../data-access-chain";
import { createDataAccessError } from "../errors";
import { studentLimitMiddleware } from "../limit-middleware";
import { archiveStudentSurveyResponsesInHub } from "../survey-response/mutations";
import {
  AddStudentSchema,
  AddStudentsToHubSchema,
  CreateStudentInHubSchema,
  DeleteStudentSchema,
  RemoveStudentFromHubSchema,
  UpdateStudentSchema,
} from "./schemas";

// Example using the predefined middleware
export const addStudent = authenticatedDataAccess()
  .input(AddStudentSchema)
  .onError({
    message: "Failed to add student",
    type: "UNEXPECTED_ERROR",
  })
  .execute(async (data, user) => {
    const [createdStudent] = await db
      .insert(student)
      .values({
        ...data,
        userId: user.id,
      })
      .returning();

    return createdStudent;
  });

// Alternative example using checkLimit method directly
export const addStudentAlternative = authenticatedDataAccess()
  .input(AddStudentSchema)
  .onError({
    message: "Failed to add student",
    type: "UNEXPECTED_ERROR",
  })
  .execute(async (data, user) => {
    const [createdStudent] = await db
      .insert(student)
      .values({
        ...data,
        userId: user.id,
      })
      .returning();

    return createdStudent;
  });

export const addStudentsToHub = authenticatedDataAccess()
  .input(AddStudentsToHubSchema)
  .onError({
    message: "Failed to add students to hub",
    type: "UNEXPECTED_ERROR",
  })
  .execute(async ({ studentIds, hubId }, user) => {
    return await db.transaction(async (trx) => {
      const sessions = await trx
        .select({ id: session.id })
        .from(session)
        .where(and(eq(session.hubId, hubId), eq(session.userId, user.id)));

      const studentHubValues = studentIds.map((studentId) => ({
        studentId,
        hubId,
      }));

      await Promise.all([
        trx.insert(studentHub).values(studentHubValues),
        sessions.length > 0
          ? addAttendance({
              data: {
                sessionIds: sessions.map((session) => session.id),
                studentIds,
                hubId,
              },
              trx,
            })
          : Promise.resolve(),
      ]);

      return { hubId };
    });
  });

export const removeStudentFromHub = authenticatedDataAccess()
  .input(RemoveStudentFromHubSchema)
  .onError({
    message: "Failed to remove student from hub",
    type: "UNEXPECTED_ERROR",
  })
  .execute(async ({ studentId, hubId }) => {
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
  });

export const createStudentInHub = authenticatedDataAccess()
  .input(CreateStudentInHubSchema)
  .onError({
    message: "Failed to create student in hub",
  })
  .use(studentLimitMiddleware)
  .execute(async ({ student: studentData, hubId }, user) => {
    // Check for existing student first to avoid unnecessary transaction
    const existingStudent = await db
      .select({ id: student.id })
      .from(student)
      .where(
        and(eq(student.email, studentData.email), eq(student.userId, user.id)),
      )
      .limit(1);

    if (existingStudent.length > 0) {
      return createDataAccessError({
        type: "DUPLICATE_RESOURCE",
        message: "Student with this email already exists",
      });
    }

    await db.transaction(async (trx) => {
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
        return createDataAccessError({
          type: "UNEXPECTED_ERROR",
          message: "Failed to create student",
        });
      }

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
