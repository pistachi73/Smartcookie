import {
  addDays,
  differenceInDays,
  format,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { useCalendarContext } from "./calendar-context";
import { MonthCalendarDayCell } from "./components/month-calendar-day-cell";

export const MonthCalendar = () => {
  const { selectedDate, sessionOccurrences } = useCalendarContext();

  const startMonth = startOfMonth(selectedDate);
  const endMonth = lastDayOfMonth(selectedDate);
  const prefixDays = startMonth.getDay(); // Get the day index of the start of the month
  const totalDays = differenceInDays(endMonth, startMonth) + 1;

  // Calculate start and end of the calendar view
  const startCalendar = subDays(startMonth, prefixDays);
  const rows = Math.ceil((totalDays + prefixDays) / 7);

  return (
    <div role="grid" className="h-full w-full flex flex-col grow">
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
              sessionOccurrences?.[format(currentDay, "yyyy-MM-dd")] || [];
            const isCurrentMonth =
              currentDay.getMonth() === selectedDate.getMonth();

            return (
              <MonthCalendarDayCell
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
