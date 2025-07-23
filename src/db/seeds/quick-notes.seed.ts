import { eq } from "drizzle-orm";

import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import quickNotes from "./data/quick-notes.seed-data";

export default async function seed(db: DB) {
  console.log("Seeding quick notes...");
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });

  if (!user) throw new Error("User not found!");

  // Get all hubs for the user to lookup by name
  const hubs = await db.query.hub.findMany({
    where: eq(schema.hub.userId, user.id),
  });

  await Promise.all(
    quickNotes.map(async (note) => {
      const hub = hubs.find((h) => h.name === note.hubName);
      if (!hub) {
        console.warn(`Hub not found for note: ${note.hubName}`);
        return;
      }

      await db.insert(schema.quickNote).values({
        userId: user.id,
        hubId: hub.id,
        content: note.content,
      });
    }),
  );
}
