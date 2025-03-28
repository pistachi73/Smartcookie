import type { CustomColor } from "@/db/schema/shared";
import { DEFAULT_CUSTOM_COLOR } from "@/shared/lib/custom-colors";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { z } from "zod";
import type { HubStatus } from "../../../db/schema/hub";

export const hubInfoSchema = z
  .object({
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
    startDate: z.custom<CalendarDate>(),
    endDate: z.custom<CalendarDate>().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date is required",
      });
    }
  })
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      data.startDate.compare(data.endDate) > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }
  });

export const defaultHubInfo: HubInfoValues = {
  name: "",
  description: "",
  level: "",
  color: DEFAULT_CUSTOM_COLOR,
  schedule: "",
  status: "active",
  startDate: today(getLocalTimeZone()),
  endDate: undefined,
};

export const serializedHubInfoSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  level: z.string().optional(),
  color: z.custom<CustomColor>(),
  schedule: z.string().optional(),
  status: z.custom<HubStatus>(),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export type HubInfoValues = z.infer<typeof hubInfoSchema>;
export type SerializedHubInfoValues = z.infer<typeof serializedHubInfoSchema>;

export const CreateHubUseCaseSchema = z.object({
  userId: z.string(),
  hubInfo: serializedHubInfoSchema,
  studentIds: z.array(z.number()).optional(),
  sessionIds: z.array(z.number()).optional(),
});
