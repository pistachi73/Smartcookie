import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { account } from "@/db/schema";
import { withProtectedDataAccess } from "../with-protected-data-access";
import { LinkOAuthAccountSchema } from "./schemas";

export const linkOAuthAccount = withProtectedDataAccess({
  options: {
    requireAuth: false,
  },
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
