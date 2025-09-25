import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { hub } from "@/db/schema";
import type { SideEffectPayloadMap } from "../side-effects-types";

export async function handleUpdateHubLastActivity(
  payload: SideEffectPayloadMap["updateHubLastActivity"],
) {
  await db
    .update(hub)
    .set({ lastActivityAt: new Date().toISOString() })
    .where(and(eq(hub.id, payload.hubId), eq(hub.userId, payload.userid)));
}
