import { useCalendarStore } from "@/providers/calendar-store-provider";
import {
  addDays,
  differenceInDays,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { useShallow } from "zustand/react/shallow";
import { getEventOccurrenceDayKey } from "../../utils";
import { MonthViewCell } from "./month-view-cell";

const useMonthView = () =>
  useCalendarStore(
    useShallow(
      ({
        selectedDate,
        groupedEventOccurrences,
        editingEventOccurrenceId,
      }) => ({
        selectedDate,
        groupedEventOccurrences,
      }),
    ),
  );

export const MonthView = () => {
  const { selectedDate, groupedEventOccurrences } = useMonthView();

  const startMonth = startOfMonth(selectedDate);
  const endMonth = lastDayOfMonth(selectedDate);

  // Get the day index of the start of the month (0 = Sunday, 6 = Saturday)
  // Convert to Monday-based (0 = Monday, 6 = Sunday)
  const prefixDays = startMonth.getDay() === 0 ? 6 : startMonth.getDay() - 1;
  const totalDays = differenceInDays(endMonth, startMonth) + 1;

  // Calculate start and end of the calendar view
  const startCalendar = subDays(startMonth, prefixDays);
  const rows = Math.ceil((totalDays + prefixDays) / 7);

  return (
    <div role="grid" className="h-full w-full flex flex-col grow">
      <div className="flex flex-row w-full border-calendar-border">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <p
            key={`weekday-header-${day}`}
            role="columnheader"
            className="flex-1 text-muted-fg  text-xs text-center py-2 font-medium uppercase"
          >
            {day}
          </p>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`month-row-${rowIndex}`}
          role="row"
          tabIndex={0}
          className="flex flex-row w-full border-calendar-border basis-full overflow-hidden"
        >
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = addDays(startCalendar, rowIndex * 7 + dayIndex);
            const dayOccurrences =
              groupedEventOccurrences[getEventOccurrenceDayKey(currentDay)] ||
              [];
            const isCurrentMonth =
              currentDay.getMonth() === selectedDate.getMonth();

            return (
              <MonthViewCell
                key={`month-cell-${dayIndex}`}
                dayIndex={dayIndex}
                rowIndex={rowIndex}
                currentDay={currentDay}
                isCurrentMonth={isCurrentMonth}
                dayOccurrences={dayOccurrences}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
