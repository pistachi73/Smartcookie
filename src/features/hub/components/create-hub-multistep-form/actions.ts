"use server";

import { db } from "@/db";
import { student } from "@/db/schema";
import { publicAction } from "@/shared/lib/safe-action";

export const getStudentsAction = publicAction.action(async () => {
  const students = await db.select().from(student);
  return { data: students };
});
