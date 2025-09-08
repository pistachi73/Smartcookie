import { and, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { attendance } from "@/db/schema";
import {
  AddAttendanceSchema,
  RemoveAllStudentAttendanceSchema,
} from "./schemas";

export const addAttendance = withProtectedDataAccess({
  schema: AddAttendanceSchema,
  callback: async ({ trx = db, data }) => {
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

export const removeAllStudentAttendance = withProtectedDataAccess({
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
