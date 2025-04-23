import { z } from "zod";

export const GetCalendarSessionsByDateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
