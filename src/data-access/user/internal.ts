"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

/**
 * Internal: Direct DB query for auth callbacks to avoid circular dependency
 * DO NOT use this function outside of auth system - use getUserById instead
 */
export const getUserByIdInternal = async (id: string) => {
  return await db.query.user.findFirst({ where: eq(user.id, id) });
};
