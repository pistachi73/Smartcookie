import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import events from "./data/event.seed-data";

export default async function seed(db: DB) {
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });
  if (!user) throw new Error("User not found!");

  await Promise.all(
    events.map(async ({ event, eventOccurrences }) => {
      console.log({ event });
      await db.insert(schema.event).values({
        id: event.id,
        ...event,
        userId: user.id,
      });

      if (eventOccurrences) {
        await Promise.all(
          eventOccurrences.map(async (occurrence) => {
            await db.insert(schema.eventOccurrence).values({
              ...occurrence,
            });
          }),
        );
      }
    }),
  );
}
