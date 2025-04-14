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

    session.notes.forEach(async (note, index) => {
      await db.insert(schema.sessionNote).values({
        userId: user.id,
        sessionId: s.id,
        ...note,
      });
    });

    session.attendance.forEach(async (attendance, index) => {
      await db.insert(schema.attendance).values({
        ...attendance,
        sessionId: s.id,
      });
    });
  });
}
