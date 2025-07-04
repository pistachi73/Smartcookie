import { Pool, neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { env } from "@/env";
import * as schema from "./schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });

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
      console.log("Transaction rolled back successfully");
    } catch (rollbackError) {
      console.error("CRITICAL: Rollback failed!", rollbackError);
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
