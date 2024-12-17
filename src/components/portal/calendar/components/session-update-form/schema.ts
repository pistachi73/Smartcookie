import { RecurrenceRuleSchema } from "@/components/ui/recurrence-select";
import type { DateValue, TimeValue } from "react-aria-components";
import { z } from "zod";

export const SessionUpdateSchema = z
  .object({
    hubId: z.number().optional(),
    title: z.string(),
    date: z.custom<DateValue>(),
    timeSchedule: z.object({
      start: z.custom<TimeValue>(),
      end: z.custom<TimeValue>(),
    }),
    timezone: z.string(),
    recurrenceRule: RecurrenceRuleSchema,
  })
  .superRefine(
    (
      {
        date,
        timeSchedule: { start, end },
        hubId,
        title,
        recurrenceRule: { frequency, interval, daysOfWeek, endDate },
      },
      ctx,
    ) => {
      if (!hubId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Hub is required",
          path: ["hubId"],
        });
      }

      if (!title) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Title is required",
          path: ["title"],
        });
      }

      if (!date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date is required",
          path: ["date"],
        });
      }

      if (!start || !end) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start and end time are required",
          path: ["timeSchedule"],
        });
      } else if (
        start?.hour > end?.hour ||
        (start?.hour === end?.hour && start?.minute >= end?.minute)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The end time must be later than the start time.",
          path: ["timeSchedule"],
        });
      }

      if (frequency === "weekly" && !daysOfWeek?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select some week days",
          path: ["recurrenceRule"],
        });
      }

      if (frequency !== "no-recurrence" && !interval) {
        console.log({ interval, frequency });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select an interval",
          path: ["recurrenceRule"],
        });
      }

      if (frequency !== "no-recurrence" && !endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select an end date",
          path: ["recurrenceRule"],
        });
      }

      if (endDate && endDate?.compare(date) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Recurrence end date must be after the session date",
          path: ["recurrenceRule"],
        });
      }
    },
  );
