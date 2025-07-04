import * as schema from "@/db/schema";
import type { DB } from "@/db/seed";
import { eq } from "drizzle-orm";
import hubs from "./data/hubs.seed-data";

export default async function seed(db: DB) {
  console.log("Seeding hubs...");
  const user = await db.query.user.findFirst({
    where: eq(schema.user.email, "oscarpulido98@gmail.com"),
  });
  if (!user) throw new Error("User not found!");
  await Promise.all(
    hubs.map(async (hub) => {
      await db.insert(schema.hub).values({
        userId: user.id,
        ...hub,
      });
    }),
  );
}
