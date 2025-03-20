import type { Time } from "@internationalized/date";
import { z } from "zod";

const serializedTime = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
});

type SerializedTime = {
  hour: number;
  minute: number;
};

const serializeTime = (time: Time): SerializedTime => {
  return {
    hour: time.hour,
    minute: time.minute,
  };
};

export { serializedTime, serializeTime, type SerializedTime };
