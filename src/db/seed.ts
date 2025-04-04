import "dotenv/config";
import { getTableName, sql } from "drizzle-orm";

import * as schema from "@/db/schema/index";

import * as seeds from "@/db/seeds";
import { env } from "@/env";
import { neon } from "@neondatabase/serverless";
import type { Table } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

const connection = neon(env.DATABASE_URL);
const db = drizzle(connection, { schema, casing: "snake_case" });
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
  schema.student,
  schema.hub,
  schema.event,
  schema.eventOccurrence,
  schema.quickNote,
  schema.session,
  schema.sessionNote,
]) {
  await resetTable(db, table);
}

async function main() {
  try {
    console.log("Seeding...");
    await seeds.user(db);
    await seeds.hub(db);
    await seeds.event(db);
    await seeds.quickNotes(db);
    await seeds.student(db);
    await seeds.session(db);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

main();
