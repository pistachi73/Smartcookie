import { db } from "@/db";
import { attendance } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { withValidationAndAuth } from "../protected-data-access";
import {
  AddAttendanceSchema,
  RemoveAllStudentAttendanceSchema,
} from "./schemas";

export const addAttendance = withValidationAndAuth({
  schema: AddAttendanceSchema,
  callback: async ({ trx = db, data }, userId) => {
    const { sessionIds, studentIds, hubId } = data;

    if (!sessionIds.length || !studentIds.length) {
      return false;
    }

    const attendances = sessionIds.flatMap((sessionId) =>
      studentIds.map((studentId) => ({
        studentId,
        sessionId,
        hubId,
      })),
    );

    await trx.insert(attendance).values(attendances);
    return true;
  },
});

export const removeAllStudentAttendance = withValidationAndAuth({
  schema: RemoveAllStudentAttendanceSchema,
  callback: async ({ trx = db, data }) => {
    const { studentId, hubId } = data;

    await trx
      .delete(attendance)
      .where(
        and(eq(attendance.studentId, studentId), eq(attendance.hubId, hubId)),
      );

    return true;
  },
});
