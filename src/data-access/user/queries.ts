"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { getAccountByUserId } from "@/data-access/accounts/queries";
import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { user } from "@/db/schema";
import { GetUserAndAccountByEmailSchema } from "./schemas";

export const getUserByEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    email: z.string().email(),
  }),
  callback: async ({ email }) => {
    return await db.query.user.findFirst({
      where: eq(user.email, email),
    });
  },
});

export const getUserById = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: z.object({
    id: z.string(),
  }),
  callback: async ({ id }) => {
    return await db.query.user.findFirst({ where: eq(user.id, id) });
  },
});

export const getUserAndAccountByEmail = withProtectedDataAccess({
  options: { requireAuth: false },
  schema: GetUserAndAccountByEmailSchema,
  callback: async ({ email }) => {
    const user = await getUserByEmail({ email });

    if (!user) {
      return { user: null, account: null };
    }

    const account = await getAccountByUserId({ userId: user.id });

    return { user, account };
  },
});
