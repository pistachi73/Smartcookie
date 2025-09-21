import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { hub } from "@/db/schema";
import type { SideEffectPayloadMap } from "../side-effects-types";

export async function handleUpdateHubLastActivity(
  payload: SideEffectPayloadMap["updateHubLastActivity"],
) {
  console.log("Updating lastActivity for hub", payload.hubId);
  await db
    .update(hub)
    .set({ lastActivityAt: new Date().toISOString() })
    .where(and(eq(hub.id, payload.hubId), eq(hub.userId, payload.userid)));
}
