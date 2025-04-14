import { serializedDateValue } from "@/shared/lib/serialize-react-aria/serialize-date-value";
import { serializedTime } from "@/shared/lib/serialize-react-aria/serialize-time";
import type { CalendarDate, Time } from "@internationalized/date";
import { z } from "zod";

export const GetSessionsByHubIdUseCaseSchema = z.object({
  hubId: z.number(),
});

export const MinimumSessionFormSchema = z.object({
  date: z.custom<CalendarDate>(),
  startTime: z.custom<Time>(),
  endTime: z.custom<Time>(),
});

const SerializedMinimumSessionFormSchema = MinimumSessionFormSchema.extend({
  date: serializedDateValue,
  startTime: serializedTime,
  endTime: serializedTime,
});

export const AddSessionFormSchema = MinimumSessionFormSchema.extend({
  rrule: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.endTime && data.startTime && data.endTime <= data.startTime) {
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

export const SerializedAddSessionFormSchema =
  SerializedMinimumSessionFormSchema.extend({
    rrule: z.string().optional(),
  });

export type AddSessionFormValues = z.infer<typeof AddSessionFormSchema>;
export type SerializedAddSessionFormValues = z.infer<
  typeof SerializedAddSessionFormSchema
>;

export const AddSessionsUseCaseSchema = z.object({
  sessions: z.array(
    z.object({
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
  hubId: z.number(),
});

export const UpdateSessionFormSchema = MinimumSessionFormSchema.extend({
  status: z.enum(["upcoming", "completed", "cancelled"]),
}).superRefine((data, ctx) => {
  if (data.endTime && data.startTime && data.endTime <= data.startTime) {
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

export const SerializedUpdateSessionFormSchema =
  SerializedMinimumSessionFormSchema.extend({
    status: z.enum(["upcoming", "completed", "cancelled"]),
  });

export type UpdateSessionFormValues = z.infer<typeof UpdateSessionFormSchema>;
export type SerializedUpdateSessionFormValues = z.infer<
  typeof SerializedUpdateSessionFormSchema
>;

export const UpdateSessionUseCaseSchema = z.object({
  sessionId: z.number(),
  hubId: z.number(),
  data: z.object({
    startTime: z.string(),
    endTime: z.string(),
    status: z.enum(["upcoming", "completed", "cancelled"]),
  }),
});

export const DeleteSessionsUseCaseSchema = z.object({
  sessionIds: z.array(z.number()),
});

export const CheckSessionConflictsUseCaseSchema = AddSessionsUseCaseSchema.pick(
  { sessions: true },
).extend({
  excludedSessionIds: z.array(z.number()).optional(),
});
