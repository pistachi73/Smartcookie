"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

export const getUserById = async (id: string) => {
  return await db.query.user.findFirst({ where: eq(user.id, id) });
};
