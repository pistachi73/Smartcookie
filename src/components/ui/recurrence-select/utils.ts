import { format } from "date-fns";
import type { DateValue } from "react-aria";

export const daysOfWeekCheckboxes: {
  id: string;
  label: string;
  longName: string;
}[] = [
  { id: "1", label: "M", longName: "Monday" },
  { id: "2", label: "T", longName: "Tuesday" },
  { id: "3", label: "W", longName: "Wednesday" },
  { id: "4", label: "T", longName: "Thursday" },
  { id: "5", label: "F", longName: "Friday" },
  { id: "6", label: "S", longName: "Saturday" },
  { id: "7", label: "S", longName: "Sunday" },
];

export const formatDailyRecurrenceRule = (
  interval?: number,
  endDate?: DateValue,
) => {
  if (!interval || !endDate) return "Select recurrence options";
  const dayLabel = interval === 1 ? "day" : "days";
  const intervalLabel = interval === 1 ? "" : interval;
  return `Occurs every ${intervalLabel} ${dayLabel} until ${format(endDate.toString(), "d LLLL yyyy")}`;
};

function formatDaysList(days: string[]): string {
  if (days.length <= 1) return days.join("");
  const lastDay = days.pop();
  return `${days.join(", ")} and ${lastDay}`;
}

export const formatWeeklyRecurrenceRule = (
  interval?: number,
  daysOfWeek?: string[],
  endDate?: DateValue,
) => {
  if (!interval || !endDate || !daysOfWeek) return "Select recurrence options";
  const weekLabel = interval === 1 ? "week" : "weeks";
  const daysOfWeekLabels = formatDaysList(
    daysOfWeek.map(
      (day) => daysOfWeekCheckboxes.find(({ id }) => id === day)?.longName,
    ) as string[],
  );
  return `Occurs every ${interval} ${weekLabel} on ${daysOfWeekLabels} until ${format(endDate.toString(), "d LLLL yyyy")}`;
};
