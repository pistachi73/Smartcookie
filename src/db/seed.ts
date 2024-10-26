import "dotenv/config";
import { getTableName, sql } from "drizzle-orm";

import * as schema from "@/db/schema/index";

import * as seeds from "@/db/seeds";
import { env } from "@/env";
import { neon } from "@neondatabase/serverless";
import type { Table } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const connection = neon(env.DATABASE_URL);
const db = drizzle(connection, { schema });
export type DB = typeof db;

async function resetTable(db: DB, table: Table) {
  console.log(`Resetting ${getTableName(table)} table!`);

  return db.execute(
    sql.raw(
      `TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE;`,
    ),
  );
}

for (const table of [
  schema.user,
  schema.twoFactorToken,
  schema.twoFactorConirmation,
  schema.verificationToken,
  schema.passwordResetToken,
]) {
  await resetTable(db, table);
}

async function main() {
  try {
    console.log("Seeding...");
    await seeds.user(db);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
