import type { Event, Occurrence } from "@/db/schema";
import type {
  CalendarView,
  UIOccurrence,
} from "@/features/calendar/types/calendar.types";
import memoize from "lodash/memoize";
import { Temporal } from "temporal-polyfill";

export const computeUIOccurrence = memoize(
  (occ: Occurrence, evt: Event): UIOccurrence => {
    const timezone = occ.overrides?.timezone || evt.timezone;
    const startInstant = new Date(
      Temporal.Instant.from(occ.startTime)
        .toZonedDateTimeISO(timezone)
        .toString({
          timeZoneName: "never",
        }),
    );
    const endInstant = new Date(
      Temporal.Instant.from(occ.endTime).toZonedDateTimeISO(timezone).toString({
        timeZoneName: "never",
      }),
    );

    return {
      ...evt,
      eventId: evt.id,
      occurrenceId: occ.id,
      startTime: startInstant,
      endTime: endInstant,
      title: occ.overrides?.title || evt.title,
      description: occ.overrides?.description || evt.description,
      timezone: occ.overrides?.timezone || evt.timezone,
      price: occ.overrides?.price || evt.price,
      color: occ.overrides?.color || evt.color,
    };
  },
  (occ, evt) => `${occ.id}-${evt.id}`,
);

export const windowPushHistory = (path: string) => {
  if (!window.history.pushState) return;
  window.history.pushState(null, "", path);
};

export const updateURL = ({
  calendarView,
  selectedDate,
}: { calendarView: CalendarView; selectedDate: Temporal.PlainDate }) => {
  const [year, month, day] = [
    selectedDate.year,
    selectedDate.month,
    selectedDate.day,
  ];

  windowPushHistory(
    `/portal/calendar/${calendarView}/${year}/${month}/${day}/`,
  );
};

export const getDatesForCalendarView = (
  date: Temporal.PlainDate,
  view: CalendarView,
): Temporal.PlainDate[] => {
  let start: Temporal.PlainDate;
  let end: Temporal.PlainDate;

  switch (view) {
    case "day":
      // Just the selected day
      return [date];

    case "week": {
      // Start from Sunday of the week (assuming Sunday is day 0)
      const dayOfWeek = date.dayOfWeek === 7 ? 0 : date.dayOfWeek; // Convert ISO day (1-7) to 0-6
      start = date.subtract({ days: dayOfWeek });
      // End on Saturday
      end = start.add({ days: 6 });
      break;
    }

    case "weekday": {
      // Start from Monday (ISO day 1)
      const dayOfWeek = date.dayOfWeek;

      if (dayOfWeek === 6 || dayOfWeek === 7) {
        // If weekend (Saturday or Sunday), get the Monday-Friday of the current week
        // Calculate how many days to go back to reach the most recent Monday
        const daysToSubtract = dayOfWeek === 6 ? 5 : 6; // Saturday(6) -> 5, Sunday(7) -> 6
        start = date.subtract({ days: daysToSubtract });
      } else {
        // Otherwise, go back to Monday of current week
        start = date.subtract({ days: dayOfWeek - 1 });
      }

      // End on Friday (start + 4 days)
      end = start.add({ days: 4 });
      break;
    }

    case "month": {
      // Get first day of the month
      const firstDayOfMonth = date.with({ day: 1 });

      // Get the day of week for the first day (1-7, where 1 is Monday and 7 is Sunday)
      const firstDayOfWeek = firstDayOfMonth.dayOfWeek;

      // Calculate how many days to go back to reach the previous Sunday
      // If it's already Sunday (7), we don't need to go back
      const daysToSubtract = firstDayOfWeek === 7 ? 0 : firstDayOfWeek;

      // Start from the Sunday before or on the first day of the month
      start = firstDayOfMonth.subtract({ days: daysToSubtract });

      // Get the last day of the month
      const lastDayOfMonth = firstDayOfMonth
        .add({ months: 1 })
        .subtract({ days: 1 });

      // Get the day of week for the last day
      const lastDayOfWeek = lastDayOfMonth.dayOfWeek;

      // Calculate how many days to add to reach the next Saturday
      // If it's already Saturday (6), we don't need to add any days
      const daysToAdd = lastDayOfWeek === 6 ? 0 : 6 - lastDayOfWeek;

      // End on the Saturday after or on the last day of the month
      end = lastDayOfMonth.add({ days: daysToAdd });

      // Calculate total days to ensure we have complete weeks (multiple of 7)
      const totalDays =
        Temporal.PlainDate.compare(start, end) === 0
          ? 1
          : Temporal.Duration.from(start.until(end)).days + 1;

      // If not a multiple of 7, add more days to make complete weeks
      if (totalDays % 7 !== 0) {
        const additionalDays = 7 - (totalDays % 7);
        end = end.add({ days: additionalDays });
      }
      break;
    }

    case "agenda": {
      // Default to next 30 days
      start = date;
      end = date.add({ days: 30 });
      break;
    }
  }

  // Generate array of all dates between start and end (inclusive)
  const allDates: Temporal.PlainDate[] = [];
  let currentDate = start;

  while (Temporal.PlainDate.compare(currentDate, end) <= 0) {
    allDates.push(currentDate);
    currentDate = currentDate.add({ days: 1 });
  }

  return allDates;
};
