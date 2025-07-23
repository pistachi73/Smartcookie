import { z } from "zod";

import type { InsertAccount } from "@/db/schema";
import { account } from "@/db/schema";
import {
  createColumnSelectionSchema,
  DatabaseTransactionSchema,
} from "../shared-schemas";

const accountColumnsSchema = createColumnSelectionSchema(account);

export const GetAccountByUserIdSchema = z.object({
  userId: z.string(),
  columns: accountColumnsSchema.optional(),
});

export const LinkOAuthAccountSchema = z.object({
  data: z.custom<InsertAccount>(),
  trx: DatabaseTransactionSchema,
});

export const GetAccountByProviderAndUserIdSchema = z.object({
  userId: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  columns: accountColumnsSchema.optional(),
});
