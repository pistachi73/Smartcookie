import type { Time } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { z } from "zod";

export const SessionOcurrenceFormSchema = z
  .object({
    hubId: z.number().optional(),
    title: z.string().min(1),
    description: z.string(),
    date: z.custom<DateValue>(),
    startTime: z.custom<Time>(),
    endTime: z.custom<Time>(),
    timezone: z.string(),
    recurrenceRule: z.string().optional(),
    participants: z.array(z.number()).optional(),
    isBillable: z.boolean(),
    price: z.number().optional(),
  })
  .refine((data) => Boolean(data.title), {
    path: ["title"],
    message: "Passwords does not match",
  });
