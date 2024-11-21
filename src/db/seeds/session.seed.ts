import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import sessions from "./data/session.seed-data";

export default async function seed(db: DB) {
  await Promise.all(
    sessions.map(async ({ session, exceptions }) => {
      await db.insert(schema.session).values({
        ...session,
      });

      if (exceptions?.length) {
        await Promise.all(
          exceptions.map(async (exception) => {
            await db.insert(schema.sessionException).values({
              ...exception,
            });
          }),
        );
      }
    }),
  );
}
