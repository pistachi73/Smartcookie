import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import students from "./data/students.seed-data";

export default async function seed(db: DB) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });
  if (!user) throw new Error("User not found!");

  // Get all hubs for the user to lookup by name
  const hubs = await db.query.hub.findMany({
    where: eq(schema.hub.userId, user.id),
  });

  await Promise.all(
    students.map(async (student) => {
      const { hubNames, ...rest } = student;

      const [newStudent] = await db
        .insert(schema.student)
        .values({
          ...rest,
          userId: user.id,
        })
        .returning();

      if (!newStudent) throw new Error("Student not created!");

      await Promise.all(
        hubNames.map(async (hubName) => {
          const hub = hubs.find((h) => h.name === hubName);
          if (!hub) {
            console.warn(
              `Hub not found for student ${student.name}: ${hubName}`,
            );
            return;
          }

          await db.insert(schema.studentHub).values({
            studentId: newStudent.id,
            hubId: hub.id,
          });
        }),
      );
    }),
  );
}
