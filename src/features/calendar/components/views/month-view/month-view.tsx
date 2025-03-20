import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { getEndOfMonth, getStartOfMonth } from "@/shared/lib/temporal/month";
import { useShallow } from "zustand/react/shallow";
import { MonthViewCell } from "./month-view-cell";

export const MonthView = () => {
  const selectedDate = useCalendarStore(
    useShallow((store) => store.selectedDate),
  );

  const startOfMonth = getStartOfMonth(selectedDate);
  const endOfMonth = getEndOfMonth(selectedDate);

  // Get the day index of the start of the month (0 = Sunday, 6 = Saturday)
  // Convert to Monday-based (0 = Monday, 6 = Sunday)
  const prefixDays =
    startOfMonth.dayOfWeek === 0 ? 6 : startOfMonth.dayOfWeek - 1;
  const totalDays = endOfMonth.day - startOfMonth.day + 1;

  // Calculate start and end of the calendar view
  const startCalendar = startOfMonth.subtract({ days: prefixDays });
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
            const date = startCalendar.add({
              days: rowIndex * 7 + dayIndex,
            });

            const isCurrentMonth = date.month === selectedDate.month;

            return (
              <MonthViewCell
                key={`month-cell-${dayIndex}`}
                date={date}
                dayIndex={dayIndex}
                rowIndex={rowIndex}
                isCurrentMonth={isCurrentMonth}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
