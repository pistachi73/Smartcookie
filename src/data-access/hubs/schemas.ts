import { z } from "zod";

import type { InsertHub } from "@/db/schema";

export const GetHubsByUserIdSchema = z.object({});

export const GetHubByIdSchema = z.object({
  hubId: z.number(),
});

const HubInfoSchema =
  z.custom<Omit<InsertHub, "userId" | "id" | "createdAt" | "updatedAt">>();

export const CreateHubUseCaseSchema = z.object({
  hubInfo: HubInfoSchema,
});

export const UpdateHubSchema = z.object({
  hubId: z.number(),
  data: HubInfoSchema,
});

export const DeleteHubSchema = z.object({
  hubId: z.number(),
});
