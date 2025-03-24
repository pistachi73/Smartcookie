import { db } from "@/db";
import { hub } from "@/db/schema";
import { z } from "zod";
import { serializedHubFormSchema } from "../lib/schemas";

export const CreateHubUseCaseSchema = z.object({
  userId: z.string(),
  formData: serializedHubFormSchema,
});

export const createHubUseCase = async (
  data: z.infer<typeof CreateHubUseCaseSchema>,
) => {
  const { userId, formData } = data;
  const { participantIds, ...rest } = formData;
  const createdHubs = await db
    .insert(hub)
    .values({
      userId,
      ...rest,
    })
    .returning();
  return createdHubs[0];
};
