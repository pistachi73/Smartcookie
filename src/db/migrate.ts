import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { env } from "@/env";
import * as schema from "./schema";

const client = neon(env.DATABASE_URL);
const db = drizzle(client, { schema });

const main = async () => {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "src/db/migrations" });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
