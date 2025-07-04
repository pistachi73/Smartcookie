"use server";

import { db } from "@/db";
import { account } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { withValidationOnly } from "../protected-data-access";
import {
  GetAccountByProviderAndUserIdSchema,
  GetAccountByUserIdSchema,
} from "./schemas";

export const getAccountByUserId = withValidationOnly({
  schema: GetAccountByUserIdSchema,
  callback: async ({ userId }) => {
    return await db.query.account.findFirst({
      where: eq(account.userId, userId),
    });
  },
});

export const getAccountByProviderAndUserId = withValidationOnly({
  schema: GetAccountByProviderAndUserIdSchema,
  callback: async ({ userId, provider, providerAccountId }) => {
    return await db.query.account.findFirst({
      where: and(
        eq(account.userId, userId),
        eq(account.provider, provider),
        eq(account.providerAccountId, providerAccountId),
      ),
    });
  },
});
