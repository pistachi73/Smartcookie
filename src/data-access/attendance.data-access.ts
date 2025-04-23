import { db } from "@/db";
import { attendance } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const addAttendance = async (
  input: { sessionIds: number[]; studentIds: number[]; hubId: number },
  trx = db,
) => {
  const { sessionIds, studentIds, hubId } = input;

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
};

export const removeStudentAttendance = async (
  input: { studentId: number; hubId: number },
  trx = db,
) => {
  const { studentId, hubId } = input;

  await trx
    .delete(attendance)
    .where(
      and(eq(attendance.studentId, studentId), eq(attendance.hubId, hubId)),
    );

  return true;
};
