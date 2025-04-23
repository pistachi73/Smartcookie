import { db } from "@/db";
import { session } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { PgSelectBase } from "drizzle-orm/pg-core";

export type SessionSelectFields = (typeof session)["_"]["columns"];

export const getSessionsByHubId = async <
  P extends Partial<SessionSelectFields>,
>(
  hubId: number,
  fields: P,
  trx = db,
) => {
  return (await trx
    .select(fields)
    .from(session)
    .where(eq(session.hubId, hubId))) as Awaited<
    PgSelectBase<any, P, "single", any>
  >;
};
