import { z } from "zod";

export const planTierSchema = z.enum(["free", "basic", "premium"]);

export const upgradePlanSchema = z.object({
  userId: z.string().uuid(),
  fromTier: planTierSchema,
  toTier: planTierSchema,
});

export const downgradePlanSchema = z.object({
  userId: z.string().uuid(),
  fromTier: planTierSchema,
  toTier: planTierSchema,
});

export const resourceCountsSchema = z.object({
  hubs: z.number().int().min(0),
  students: z.number().int().min(0),
  notes: z.number().int().min(0),
});

export const archiveResourcesSchema = z.object({
  userId: z.string().uuid(),
  resourceType: z.enum(["hubs", "sessions", "students", "quick-notes"]),
  keepCount: z.number().int().min(0),
});

export const unarchiveResourcesSchema = z.object({
  userId: z.string().uuid(),
  resourceType: z.enum(["hubs", "sessions", "students", "quick-notes"]),
  maxCount: z.number().int().min(0),
});

export type PlanTier = z.infer<typeof planTierSchema>;
export type UpgradePlanInput = z.infer<typeof upgradePlanSchema>;
export type DowngradePlanInput = z.infer<typeof downgradePlanSchema>;
export type ResourceCounts = z.infer<typeof resourceCountsSchema>;
export type ArchiveResourcesInput = z.infer<typeof archiveResourcesSchema>;
export type UnarchiveResourcesInput = z.infer<typeof unarchiveResourcesSchema>;
