import type { DateValue } from "react-aria";
import { z } from "zod";

const serializedDateValue = z.object({
  year: z.number(),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
});

type SerializedDateValue = z.infer<typeof serializedDateValue>;

const serializeDateValue = (date: DateValue): SerializedDateValue => {
  return {
    year: date.year,
    month: date.month,
    day: date.day,
  };
};

export { serializeDateValue, serializedDateValue, type SerializedDateValue };
