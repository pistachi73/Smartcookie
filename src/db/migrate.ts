import { neon, Pool } from "@neondatabase/serverless";
import "dotenv/config";
import { readFile, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { env } from "@/env";
import * as schema from "./schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });
const JOURNAL_PATH = "src/db/migrations/meta/_journal.json";
const MIGRATIONS_FOLDER = "src/db/migrations";

interface JournalEntry {
  idx: number;
  version: string;
  when: number;
  tag: string;
  breakpoints: boolean;
}

interface Journal {
  version: string;
  dialect: string;
  entries: JournalEntry[];
}

const readJournal = async (): Promise<Journal> => {
  try {
    const content = await readFile(JOURNAL_PATH, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.warn("Could not read journal file:", error);
    return { version: "7", dialect: "postgresql", entries: [] };
  }
};

const writeJournal = async (journal: Journal): Promise<void> => {
  await writeFile(JOURNAL_PATH, JSON.stringify(journal, null, 2));
};

const cleanupLastMigrationEntry = async (): Promise<void> => {
  const currentJournal = await readJournal();

  if (currentJournal.entries.length === 0) {
    console.log("No migration entries to clean up");
    return;
  }

  // Get the last entry (most recent migration) - guaranteed to exist after length check
  const lastEntry = currentJournal.entries[currentJournal.entries.length - 1]!;

  console.log(`Cleaning up last migration entry: ${lastEntry.tag}`);

  // Remove the migration SQL file
  const migrationFile = join(MIGRATIONS_FOLDER, `${lastEntry.tag}.sql`);
  try {
    await unlink(migrationFile);
    console.log(`Removed migration file: ${lastEntry.tag}.sql`);
  } catch (error) {
    console.warn(
      `Could not remove migration file ${lastEntry.tag}.sql:`,
      error,
    );
  }

  // Remove the snapshot file
  const snapshotFile = join(
    MIGRATIONS_FOLDER,
    `meta/${lastEntry.idx.toString().padStart(4, "0")}_snapshot.json`,
  );
  try {
    await unlink(snapshotFile);
    console.log(
      `Removed snapshot file: ${lastEntry.idx.toString().padStart(4, "0")}_snapshot.json`,
    );
  } catch (error) {
    console.warn(
      `Could not remove snapshot file ${lastEntry.idx.toString().padStart(4, "0")}_snapshot.json:`,
      error,
    );
  }

  // Remove the last entry from journal
  const updatedJournal = {
    ...currentJournal,
    entries: currentJournal.entries.slice(0, -1),
  };

  await writeJournal(updatedJournal);
  console.log("Removed last journal entry and restored journal state");
};

const runMigrationWithTransaction = async () => {
  const poolClient = await pool.connect();

  try {
    console.log("Starting transaction...");
    await poolClient.query("BEGIN");

    console.log("Running migrations...");
    const transactionalDb = drizzle(neon(env.DATABASE_URL), {
      schema,
      casing: "snake_case",
    });

    await migrate(transactionalDb, { migrationsFolder: "src/db/migrations" });

    console.log("Committing transaction...");
    await poolClient.query("COMMIT");

    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed, rolling back...", error);

    try {
      await poolClient.query("ROLLBACK");
      console.log("Database transaction rolled back successfully");

      // Clean up the last migration entry and its associated files
      await cleanupLastMigrationEntry();
      console.log("Migration files and journal cleaned up successfully");
    } catch (rollbackError) {
      console.error("CRITICAL: Database rollback failed!", rollbackError);
      console.error("Attempting to clean up migration files anyway...");

      try {
        await cleanupLastMigrationEntry();
        console.log(
          "Migration files cleaned up despite database rollback failure",
        );
      } catch (cleanupError) {
        console.error("CRITICAL: File cleanup also failed!", cleanupError);
        console.error("Manual cleanup required for:");
        console.error("- Database state");
        console.error("- Migration journal file");
        console.error("- Generated migration files");
      }
    }

    throw error;
  } finally {
    poolClient.release();
  }
};

const main = async () => {
  try {
    await runMigrationWithTransaction();
  } catch (error) {
    console.error("Migration process failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
