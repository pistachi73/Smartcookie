import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { account } from "@/db/schema";
import { withValidationOnly } from "../protected-data-access";
import { LinkOAuthAccountSchema } from "./schemas";

export const linkOAuthAccount = withValidationOnly({
  schema: LinkOAuthAccountSchema,
  callback: async ({ data, trx = db }) => {
    const [linkedAccount] = await trx.insert(account).values(data).returning();
    return linkedAccount;
  },
});

export const unlinkOAuthAccount = async (
  provider: string,
  providerAccountId: string,
) => {
  const [unlinkedAccount] = await db
    .delete(account)
    .where(
      and(
        eq(account.provider, provider),
        eq(account.providerAccountId, providerAccountId),
      ),
    )
    .returning();

  return unlinkedAccount;
};
