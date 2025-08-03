import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { useMemo } from "react";
import type { Temporal } from "temporal-polyfill";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import type { CalendarView } from "@/features/calendar/types/calendar.types";

interface UseCalendarHeaderTitleProps {
  selectedDate: Temporal.PlainDate;
  calendarView: CalendarView;
}

export const useCalendarHeaderTitle = ({
  selectedDate,
  calendarView,
}: UseCalendarHeaderTitleProps) => {
  const { down } = useViewport();

  const title = useMemo(() => {
    // Convert Temporal date to JavaScript Date
    const jsDate = new Date(
      selectedDate.year,
      selectedDate.month - 1,
      selectedDate.day,
    );
    const isMobile = down("lg");

    switch (calendarView) {
      case "day":
        if (isMobile) {
          return format(jsDate, "d MMM, yyyy");
        }
        return format(jsDate, "d MMMM, yyyy");

      case "week": {
        const weekStart = startOfWeek(jsDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(jsDate, { weekStartsOn: 1 });

        if (isMobile) {
          // Mobile: Short format
          if (
            weekStart.getMonth() === weekEnd.getMonth() &&
            weekStart.getFullYear() === weekEnd.getFullYear()
          ) {
            return `${format(weekStart, "d")}-${format(weekEnd, "d MMM")}`;
          }
          return `${format(weekStart, "d MMM")}-${format(weekEnd, "d MMM")}`;
        }

        // Desktop: Full format
        if (
          weekStart.getMonth() === weekEnd.getMonth() &&
          weekStart.getFullYear() === weekEnd.getFullYear()
        ) {
          return `${format(weekStart, "d")} - ${format(weekEnd, "d MMMM, yyyy")}`;
        }

        if (weekStart.getFullYear() === weekEnd.getFullYear()) {
          return `${format(weekStart, "d MMMM")} - ${format(weekEnd, "d MMMM, yyyy")}`;
        }

        return `${format(weekStart, "d MMMM, yyyy")} - ${format(weekEnd, "d MMMM, yyyy")}`;
      }

      case "month":
        if (isMobile) {
          return format(jsDate, "MMM yyyy");
        }
        return format(jsDate, "MMMM yyyy");

      case "agenda": {
        const rangeEndDate = addDays(jsDate, 14);

        if (isMobile) {
          // Mobile: Short format
          if (
            jsDate.getMonth() === rangeEndDate.getMonth() &&
            jsDate.getFullYear() === rangeEndDate.getFullYear()
          ) {
            return format(jsDate, "MMM yyyy");
          }
          return `${format(jsDate, "MMM")}-${format(rangeEndDate, "MMM yyyy")}`;
        }

        // Desktop: Full format
        if (
          jsDate.getMonth() === rangeEndDate.getMonth() &&
          jsDate.getFullYear() === rangeEndDate.getFullYear()
        ) {
          return format(jsDate, "MMMM yyyy");
        }

        if (jsDate.getFullYear() === rangeEndDate.getFullYear()) {
          return `${format(jsDate, "MMMM")} - ${format(rangeEndDate, "MMMM yyyy")}`;
        }

        return `${format(jsDate, "MMMM yyyy")} - ${format(rangeEndDate, "MMMM yyyy")}`;
      }

      default:
        return "";
    }
  }, [selectedDate, calendarView, down]);

  return { title };
};
