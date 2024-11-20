import { cn } from "@/lib/utils";
import {
  addDays,
  differenceInDays,
  format,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { useCalendarContext } from "./calendar-context";

export const MonthCalendar = () => {
  const { selectedDate } = useCalendarContext();

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
          className="flex flex-row w-full border-border basis-full grow"
        >
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = addDays(startCalendar, rowIndex * 7 + dayIndex);
            const isCurrentMonth =
              currentDay.getMonth() === selectedDate.getMonth();

            return (
              <div key={`month-cell-${dayIndex}`} className="flex-1">
                <div
                  className={cn(
                    "h-full w-full border text-center p-1",
                    isCurrentMonth ? "" : "",
                    dayIndex === 0 && "border-l-0",
                    dayIndex === 6 && "border-r-0",
                  )}
                >
                  {rowIndex === 0 && (
                    <p className="text-sm text-neutral-500 lowercase">
                      {format(currentDay, "iii")}
                    </p>
                  )}

                  <span
                    className={cn(
                      "text-base font-medium",
                      isCurrentMonth
                        ? "text-responsive-dark"
                        : "text-neutral-500",
                    )}
                  >
                    {currentDay.getDate()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
