import type { DB } from "@/db";
import { db } from "@/db";
import { type Column, sql } from "drizzle-orm";
import { z } from "zod";

export function generateRandomToken(length: number) {
  return Array.from(
    crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2))),
    (b) => `0${(b & 0xff).toString(16)}`.slice(-2),
  ).join("");
}

function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export const hashPassword = async (password: string, initialSalt?: string) => {
  const salt = initialSalt ?? generateRandomToken(32);

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(salt),
      iterations: 10000,
      hash: "SHA-512",
    },
    passwordKey,
    256,
  );

  const hashedPassword = buf2hex(derivedKey);

  return { hashedPassword, salt };
};

export async function createTransaction<T extends typeof db>(
  cb: (trx: T) => void,
) {
  await db.transaction(cb as any);
}

// Custom Zod type for database transaction
export const DatabaseTransactionSchema = z
  .custom<DB>((val) => {
    // Basic validation - check if it has the expected database methods
    return (
      val &&
      typeof val === "object" &&
      "select" in val &&
      "insert" in val &&
      "update" in val &&
      "delete" in val &&
      "transaction" in val
    );
  }, "Invalid database transaction object")
  .optional()
  .default(db);

export const parseDateWithTimezone = (
  date: Column,
  as: string,
  timestamp?: Column,
) =>
  sql<string>`trim(both '"' from to_json(${date}::timestamptz at time zone ${timestamp ?? "UTC"})::text)`.as(
    as,
  );

// Function to get timestamp in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)
export const getTimestampISO = (date: Column, as: string) =>
  sql<string>`to_char(${date} at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`.as(
    as,
  );
