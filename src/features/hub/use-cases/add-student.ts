import { db } from "@/db";
import { student } from "@/db/schema";
import { z } from "zod";

export const addStudentUseCaseSchema = z.object({
  userId: z.string(),
  formData: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
});

export const addStudentUseCase = async (
  data: z.infer<typeof addStudentUseCaseSchema>,
) => {
  const { userId, formData } = data;
  const [createdStudent] = await db
    .insert(student)
    .values({
      ...formData,
      userId,
    })
    .returning();

  return createdStudent;
};
