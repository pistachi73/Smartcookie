import { Temporal } from "temporal-polyfill";

import { getMonthViewDateRange } from "@/features/calendar/lib/utils";
import type { CalendarView } from "@/features/calendar/types/calendar.types";

export const windowPushHistory = (path: string) => {
  if (!window.history.pushState) return;
  window.history.pushState(null, "", path);
};

export const updateURL = ({
  calendarView,
  selectedDate,
}: {
  calendarView: CalendarView;
  selectedDate: Temporal.PlainDate;
}) => {
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
      // Start from Monday (ISO day 1)
      const dayOfWeek = date.dayOfWeek;
      start = date.subtract({ days: dayOfWeek - 1 });
      // End on Sunday
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
      // 🚀 Use shared utility function for consistent month grid calculation
      const monthRange = getMonthViewDateRange(date);
      start = monthRange.start;
      end = monthRange.end;
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
