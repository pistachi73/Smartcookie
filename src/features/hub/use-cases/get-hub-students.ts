import { db } from "@/db";
import { student, studentHub } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const GetHubStudentsSchema = z.object({
  userId: z.string(),
  hubId: z.number(),
});

export const getHubStudentsUseCase = async ({
  userId,
  hubId,
}: z.infer<typeof GetHubStudentsSchema>) => {
  const students = await db
    .select({
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,
    })
    .from(student)
    .leftJoin(studentHub, eq(student.id, studentHub.studentId))
    .where(and(eq(studentHub.hubId, hubId), eq(student.userId, userId)));

  return students;
};
