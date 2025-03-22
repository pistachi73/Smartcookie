import { Temporal } from "temporal-polyfill";

export const getHubDuration = (startDate: string, endDate: string) => {
  const start = Temporal.PlainDate.from(startDate);
  const end = Temporal.PlainDate.from(endDate);

  const duration = start.until(end);
  const totalDays = duration.days;

  const weeks = Math.round(totalDays / 7);

  return weeks;
};
