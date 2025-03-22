import { hashPassword } from "@/data-access/utils";
import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import students from "./data/students.seed-data";

export default async function seed(db: DB) {
  await Promise.all(
    students.map(async (student) => {
      const { password, hubs, ...rest } = student;
      const { hashedPassword, salt } = await hashPassword(password);

      await db.insert(schema.student).values({
        ...rest,
        password: hashedPassword,
        salt,
      });

      await Promise.all(
        hubs.map(async (hubId) => {
          await db.insert(schema.studentHub).values({
            studentId: rest.id,
            hubId,
          });
        }),
      );
    }),
  );
}
