import type { Time } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { z } from "zod";

import {
  serializeDateValue,
  serializedDateValue,
} from "@/shared/lib/serialize-react-aria/serialize-date-value";
import {
  serializedTime,
  serializeTime,
} from "@/shared/lib/serialize-react-aria/serialize-time";

export const OccurrenceFormSchema = z
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
    color: z.string().optional(),
  })
  .refine((data) => Boolean(data.title), {
    path: ["title"],
    message: "Passwords does not match",
  });

export const SerializedOccurrenceFormSchema = z.object({
  hubId: z.number().optional(),
  title: z.string().min(1),
  description: z.string(),
  date: serializedDateValue,
  startTime: serializedTime,
  endTime: serializedTime,
  timezone: z.string(),
  recurrenceRule: z.string().optional(),
  participants: z.array(z.number()).optional(),
  isBillable: z.boolean(),
  price: z.number().optional(),
  color: z.string().optional(),
});

export const serializeOcurrenceFormData = (
  data: z.infer<typeof OccurrenceFormSchema>,
): z.infer<typeof SerializedOccurrenceFormSchema> => {
  return {
    ...data,
    date: serializeDateValue(data.date),
    startTime: serializeTime(data.startTime),
    endTime: serializeTime(data.endTime),
  };
};
