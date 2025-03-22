import { db } from "@/db";
import { hub } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const GetHubsSchema = z.object({
  userId: z.string(),
});

export const getHubsUseCase = async ({
  userId,
}: z.infer<typeof GetHubsSchema>) => {
  const hubs = await db.select().from(hub).where(eq(hub.userId, userId));
  return hubs;
};
