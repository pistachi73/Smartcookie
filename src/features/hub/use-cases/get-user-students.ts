import { db } from "@/db";
import { student } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const GetUserStudentsSchema = z.object({
  userId: z.string(),
});

export const getUserStudentsUseCase = async ({
  userId,
}: z.infer<typeof GetUserStudentsSchema>) => {
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
};
