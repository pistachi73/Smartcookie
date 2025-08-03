import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "@/env";
import * as schema from "./schema";

const connection = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle(connection, { schema, casing: "snake_case" });

export type DB = typeof db;
