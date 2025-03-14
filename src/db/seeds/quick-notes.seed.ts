import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import quickNotes from "./data/quick-notes.seed-data";

export default async function seed(db: DB) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });

  if (!user) throw new Error("User not found!");

  await Promise.all(
    quickNotes.map(async (note) => {
      await db.insert(schema.quickNote).values({
        userId: user.id,
        ...note,
      });
    }),
  );
}
