import { Pool } from "@neondatabase/serverless";

import * as schema from "./schema";

import { env } from "@/env";
import { drizzle } from "drizzle-orm/neon-serverless";

const connection = new Pool({
  connectionString: env.DATABASE_URL,
});
export const db = drizzle(connection, { schema, casing: "snake_case" });

export type DB = typeof db;
