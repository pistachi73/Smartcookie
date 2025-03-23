import { db } from "@/db";
import { student, studentHub } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const GetHubStudentsSchema = z.object({
  hubId: z.number(),
});

export const getHubStudentsUseCase = async ({
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
    .innerJoin(studentHub, eq(student.id, studentHub.studentId))
    .where(eq(studentHub.hubId, hubId));

  return students;
};
