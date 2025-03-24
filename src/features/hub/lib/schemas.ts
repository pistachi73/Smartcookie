import type { CustomColor } from "@/db/schema/shared";
import { DEFAULT_CUSTOM_COLOR } from "@/shared/lib/custom-colors";
import { z } from "zod";
import type { HubStatus } from "../../../db/schema/hub";

export const hubFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
  level: z.string().max(20, "Level must be 20 characters or less").optional(),
  color: z.custom<CustomColor>(),
  schedule: z.string().optional(),
  status: z.custom<HubStatus>(),
  hasEndDate: z.boolean().default(true),
  startDate: z.date(),
  endDate: z.date().nullable().optional(),
  participantIds: z.array(z.number()).optional(),
});

export type HubFormValues = z.infer<typeof hubFormSchema>;

export const defaultFormData: HubFormValues = {
  name: "",
  description: "",
  level: "",
  color: DEFAULT_CUSTOM_COLOR,
  schedule: "",
  status: "active",
  hasEndDate: true,
  startDate: new Date(),
  endDate: null,
  participantIds: [],
};

export const serializedHubFormSchema = hubFormSchema
  .omit({ hasEndDate: true })
  .transform((values) => ({
    ...values,
    startDate: values.startDate.toISOString(),
    endDate: values.endDate?.toISOString(),
  }));
