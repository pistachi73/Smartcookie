import { CalendarDateTime, Time } from "@internationalized/date";

export type TimeSelectOption = {
  label: string;
  value: {
    hour: number;
    minute: number;
  };
  difference: Time | null;
  isDisabled: boolean;
};

export const generateTimeSelectOptions = (
  minValue?: Time,
): Iterable<TimeSelectOption> => {
  const options: TimeSelectOption[] = [];
  const start = new CalendarDateTime(1, 1, 1, 0, 0);
  const end = new CalendarDateTime(1, 1, 1, 23, 59);

  let currentTime = start;

  while (currentTime.compare(end) <= 0) {
    const difference = minValue
      ? calculateDifference(
          new Time(minValue.hour, minValue.minute),
          new Time(currentTime.hour, currentTime.minute),
        )
      : null;

    options.push({
      label: formatLabel(currentTime.hour, currentTime.minute),
      value: {
        hour: currentTime.hour,
        minute: currentTime.minute,
      },
      difference,
      isDisabled: minValue
        ? new Time(currentTime.hour, currentTime.minute).compare(minValue) <= 0
        : false,
    });

    currentTime = currentTime.add({ minutes: 15 });
  }

  return options;
};

export const parseTimeInput = (input: string) => {
  const cleanInput = input.trim();
  const regex = /^(2[0-3]|[01]?[0-9])[: ]?([0-5][0-9])?(?:\s?(am|pm))?$/i; // Matches HH MM, HH:MM, HHMM, with optional space or colon between HH and MM
  const match = cleanInput.match(regex);
  if (match) {
    let hour = Number.parseInt(match[1]!, 10);
    const minute = match[2] !== undefined ? Number.parseInt(match[2], 10) : 0; // Default to 0 if minutes are not provided
    const period = match[3] ? match[3].toLowerCase() : null;

    if (period === "pm" && hour < 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;

    if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
      return { hour, minute };
    }
  }
  return null;
};

export const calculateDifference = (
  startTime: Time,
  endTime: Time,
): Time | null => {
  if (startTime.compare(endTime) >= 0) return null;
  const diffInMinutes = endTime.minute - startTime.minute;
  const diffInHours = endTime.hour - startTime.hour;
  return new Time(diffInHours, diffInMinutes);
};

export const generateTimeValue = (
  hour: number,
  minute: number,
  minValue?: Time,
): Time => {
  let timeValue = new Time(hour, minute);

  // console.log({ timeValue, minValue, compare: minValue?.compare(timeValue) });
  if (minValue && timeValue.compare(minValue) < 0) {
    const willBeNextDay = minValue.hour === 23 && minValue.minute >= 45;
    const minutes = willBeNextDay ? 59 - minValue.minute : 15;
    timeValue = minValue.add({
      minutes,
    });
  }

  return timeValue;
};

export const formatLabel = (hour: number, minute: number) => {
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

export const formatDifferenceLabel = (difference: Time | null) => {
  if (!difference) return "";
  return `(${difference.hour}h${difference.minute ? " " : ""}${difference.minute ? `${difference.minute}m` : ""})`;
};
