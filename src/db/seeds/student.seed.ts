import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import students from "./data/students.seed-data";

export default async function seed(db: DB) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });
  if (!user) throw new Error("User not found!");
  await Promise.all(
    students.map(async (student) => {
      const { hubs, ...rest } = student;

      const [newStudent] = await db
        .insert(schema.student)
        .values({
          ...rest,
          userId: user.id,
        })
        .returning();

      if (!newStudent) throw new Error("Student not created!");

      await Promise.all(
        hubs.map(async (hubId) => {
          await db.insert(schema.studentHub).values({
            studentId: newStudent.id,
            hubId,
          });
        }),
      );
    }),
  );
}
