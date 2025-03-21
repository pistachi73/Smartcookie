import { db } from "@/db";
import { hub } from "@/db/schema";
import type { HubSummary } from "@/features/notes/types/quick-notes.types";
import { eq } from "drizzle-orm";

export const getHubsByUserIdUseCase = async (userId: string) => {
  const hubs = await db
    .select({
      id: hub.id,
      name: hub.name,
      color: hub.color,
    })
    .from(hub)
    .where(eq(hub.userId, userId));

  return [
    { id: 0, name: "General Notes", color: "neutral" },
    ...hubs,
  ] as HubSummary[];
};
