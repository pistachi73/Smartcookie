import { z } from "zod";

export const GetHubsByUserIdSchema = z.object({});

export const GetHubByIdSchema = z.object({
  hubId: z.number(),
});
