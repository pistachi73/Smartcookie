import type { CustomColor } from "@/db/schema/shared";
import { DEFAULT_CUSTOM_COLOR } from "@/shared/lib/custom-colors";
import { serializedDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializedTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import {
  type CalendarDate,
  Time,
  getLocalTimeZone,
  today,
} from "@internationalized/date";
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

export const GetHubByIdUseCaseSchema = z.object({
  hubId: z.number(),
});

export const GetHubSessionsUseCaseSchema = z.object({
  userId: z.string(),
  hubId: z.number(),
});

const UpdateSessionNoteOrderSchema = z.object({
  noteId: z.number(),
  order: z.number(),
});

export const UpdateSessionNoteInputSchema = z.object({
  noteId: z.number(),
  source: z.object({
    sessionId: z.number(),
    position: z.enum(["past", "present", "future"]),
  }),
  target: z.object({
    sessionId: z.number(),
    position: z.enum(["past", "present", "future"]),
  }),
});

export const UpdateSessionNoteSchema = z.array(UpdateSessionNoteInputSchema);

export const GetSessionNotesUseCaseSchema = z.object({
  sessionId: z.number(),
});

export const AddSessionUseCaseSchema = z.object({
  userId: z.string(),
  hubId: z.number(),
  startTime: z.string(),
  endTime: z.string(),
});

export const AddSessionNoteUseCaseSchema = z.object({
  sessionId: z.number(),
  content: z.string().min(1, "Content is required"),
  position: z.enum(["past", "present", "future"]),
});

export const DeleteSessionNoteUseCaseSchema = z.object({
  userId: z.string(),
  noteId: z.number(),
  sessionId: z.number(),
});

export const SessionFormSchema = z
  .object({
    date: z.custom<CalendarDate>(),
    startTime: z.custom<Time>(),
    endTime: z.custom<Time>(),
    rrule: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endTime && data.startTime && data.endTime < data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }

    if (!data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Start time is required",
      });
    }

    if (!data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time is required",
      });
    }
  });

export const SerializedSessionFormSchema = z.object({
  date: serializedDateValue,
  startTime: serializedTime,
  endTime: serializedTime,
  rrule: z.string().optional(),
});

export const AddSessionsUseCaseSchema = z.object({
  sessions: z.array(
    z.object({
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
  hubId: z.number(),
  userId: z.string(),
});

export type SessionFormValues = z.infer<typeof SessionFormSchema>;
export type SerializedSessionFormValues = z.infer<
  typeof SerializedSessionFormSchema
>;
