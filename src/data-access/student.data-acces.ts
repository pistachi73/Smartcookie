import { db } from "@/db";
import {
  type InsertStudent,
  type InsertStudentHub,
  student,
  studentHub,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { PgSelectBase } from "drizzle-orm/pg-core";

export type StudentSelectFields = (typeof student)["_"]["columns"];

export const getStudentsByHubId = async <
  P extends Partial<StudentSelectFields>,
>(
  hubId: number,
  fields: P,
  trx = db,
) => {
  return (await trx
    .select(fields)
    .from(studentHub)
    .where(eq(studentHub.hubId, hubId))) as Awaited<
    PgSelectBase<any, P, "single", any>
  >;
};

export const createStudent = async (input: InsertStudent, trx = db) => {
  const [createdStudent] = await trx.insert(student).values(input).returning();
  return createdStudent;
};

export const addStudentToHub = async (input: InsertStudentHub, trx = db) => {
  const [createdStudentHub] = await trx
    .insert(studentHub)
    .values(input)
    .returning();
  return createdStudentHub;
};

export const removeStudentFromHub = async (
  input: { studentId: number; hubId: number },
  trx = db,
) => {
  const [deletedStudentHub] = await trx
    .delete(studentHub)
    .where(
      and(
        eq(studentHub.studentId, input.studentId),
        eq(studentHub.hubId, input.hubId),
      ),
    )
    .returning();
  return deletedStudentHub;
};
