import type { InsertHub } from "@/db/schema";
import { z } from "zod";

export const GetHubsByUserIdSchema = z.object({});

export const GetHubByIdSchema = z.object({
  hubId: z.number(),
});

const HubInfoSchema =
  z.custom<Omit<InsertHub, "userId" | "id" | "createdAt" | "updatedAt">>();

export const CreateHubUseCaseSchema = z.object({
  hubInfo: HubInfoSchema,
  studentIds: z.array(z.number()).optional(),
  sessions: z
    .array(
      z.object({
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .optional(),
});
