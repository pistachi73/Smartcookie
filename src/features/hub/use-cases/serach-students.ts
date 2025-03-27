import { db } from "@/db";
import { student, studentHub } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const searchStudentsUseCaseSchema = z.object({
  userId: z.string(),
  query: z.string().min(1, "Query is required"),
});

type SearchStudentsUseCaseInput = z.infer<typeof searchStudentsUseCaseSchema>;

export const searchStudentsUseCase = async (
  input: SearchStudentsUseCaseInput,
) => {
  const { userId, query } = input;

  // Convert search terms to tsquery format
  const searchTerms = query
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => `${term}:*`) // Add prefix matching
    .join(" & ");

  const students = await db
    .selectDistinct({
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,
    })
    .from(student)
    .innerJoin(studentHub, eq(student.id, studentHub.studentId))
    .where(
      and(
        eq(student.userId, userId),
        sql`to_tsvector('english', ${student.name} || ' ' || ${student.email}) @@ to_tsquery('english', ${searchTerms})`,
      ),
    )
    .limit(10);

  return students;
};
