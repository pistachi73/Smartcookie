import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import sessions from "./data/sessions.seed-data";

export default async function seed(db: DB) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });

  if (!user) throw new Error("User not found!");

  const hubId = 1;

  const hubStudents = await db
    .select({
      id: schema.student.id,
    })
    .from(schema.student)
    .leftJoin(
      schema.studentHub,
      eq(schema.student.id, schema.studentHub.studentId),
    )
    .where(eq(schema.studentHub.hubId, hubId));

  sessions.forEach(async (session, index) => {
    const [s] = await db
      .insert(schema.session)
      .values({
        ...session.session,
        userId: user.id,
        hubId,
      })
      .returning({ id: schema.session.id });

    if (!s) throw new Error("Session not found!");

    session.notes.forEach(async (note) => {
      await db.insert(schema.sessionNote).values({
        userId: user.id,
        sessionId: s.id,
        ...note,
      });
    });

    hubStudents.forEach(async (student) => {
      const statuses = [
        "present",
        "present",
        "present",
        "present",
        "absent",
      ] as const;
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      await db.insert(schema.attendance).values({
        studentId: student.id,
        sessionId: s.id,
        status: randomStatus,
        hubId,
      });
    });
  });
}
