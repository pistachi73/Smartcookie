import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import sessions from "./data/sessions.seed-data";

export default async function seed(db: DB) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });

  if (!user) throw new Error("User not found!");

  // Get all hubs for the user to lookup by name
  const hubs = await db.query.hub.findMany({
    where: eq(schema.hub.userId, user.id),
  });

  for (const sessionData of sessions) {
    const { hubName, session, notes } = sessionData;

    const hub = hubs.find((h) => h.name === hubName);
    if (!hub) {
      console.warn(`Hub not found for session: ${hubName}`);
      continue;
    }

    const hubStudents = await db
      .select({
        id: schema.student.id,
      })
      .from(schema.student)
      .leftJoin(
        schema.studentHub,
        eq(schema.student.id, schema.studentHub.studentId),
      )
      .where(eq(schema.studentHub.hubId, hub.id));

    const [s] = await db
      .insert(schema.session)
      .values({
        ...session,
        userId: user.id,
        hubId: hub.id,
      })
      .returning({ id: schema.session.id });

    if (!s) throw new Error("Session not found!");

    // Create session notes
    for (const note of notes) {
      await db.insert(schema.sessionNote).values({
        userId: user.id,
        sessionId: s.id,
        ...note,
      });
    }

    // Create attendance records for all students in the hub
    for (const student of hubStudents) {
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
        hubId: hub.id,
      });
    }
  }
}
