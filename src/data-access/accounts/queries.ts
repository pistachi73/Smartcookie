"use server";

import { and, eq } from "drizzle-orm";

import { withProtectedDataAccess } from "@/data-access/with-protected-data-access";
import { db } from "@/db";
import { account } from "@/db/schema";
import {
  GetAccountByProviderAndUserIdSchema,
  GetAccountByUserIdSchema,
} from "./schemas";

export const getAccountByUserId = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: GetAccountByUserIdSchema,
  callback: async ({ userId, columns }) => {
    return await db.query.account.findFirst({
      where: eq(account.userId, userId),
      columns,
    });
  },
});

export const getAccountByProviderAndUserId = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
  schema: GetAccountByProviderAndUserIdSchema,
  callback: async ({ userId, provider, providerAccountId, columns }) => {
    return await db.query.account.findFirst({
      where: and(
        eq(account.userId, userId),
        eq(account.provider, provider),
        eq(account.providerAccountId, providerAccountId),
      ),
      columns,
    });
  },
});
