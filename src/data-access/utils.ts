import { db } from "@/db";
import { type Column, sql } from "drizzle-orm";

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

export const parseDateWithTimezone = (
  date: Column,
  as: string,
  timestamp?: Column,
) =>
  sql<string>`trim(both '"' from to_json(${date}::timestamptz at time zone ${timestamp ?? "UTC"})::text)`.as(
    as,
  );
