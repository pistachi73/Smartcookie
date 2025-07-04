import type { InsertAccount } from "@/db/schema";
import { z } from "zod";
import { DatabaseTransactionSchema } from "../shared-schemas";

export const GetAccountByUserIdSchema = z.object({
  userId: z.string(),
});

export const LinkOAuthAccountSchema = z.object({
  data: z.custom<InsertAccount>(),
  trx: DatabaseTransactionSchema,
});

export const GetAccountByProviderAndUserIdSchema = z.object({
  userId: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
});
