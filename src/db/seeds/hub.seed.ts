import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import hubs from "./data/hubs.seed-data";

export default async function seed(db: DB) {
  await Promise.all(
    hubs.map(async (hub) => {
      await db.insert(schema.hub).values({
        ...hub,
      });
    }),
  );
}
