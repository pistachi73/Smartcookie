import { z } from "zod";

export const getNextSessionUseCaseSchema = z.object({
  userId: z.string(),
});
