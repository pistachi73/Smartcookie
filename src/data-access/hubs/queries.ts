import { db } from "@/db";
import { hub } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withAuthenticationNoInput } from "../protected-data-access";

export const getHubsByUserIdForQuickNotes = withAuthenticationNoInput({
  callback: async (userId) => {
    return await db
      .select({
        id: hub.id,
        name: hub.name,
        color: hub.color,
      })
      .from(hub)
      .where(eq(hub.userId, userId));
  },
});
