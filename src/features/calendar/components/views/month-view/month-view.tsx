import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { MonthViewCell } from "./month-view-cell";

export const MonthView = () => {
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const visibleDates = useCalendarStore((store) => store.visibleDates);
  const rows = Math.floor(visibleDates.length / 7);

  return (
    <div role="grid" className="h-full w-full flex flex-col grow">
      <div className="flex flex-row w-full border-calendar-border">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={`weekday-header-${day}`}
            className="flex-1 text-muted-fg  text-xs text-center py-2 font-medium uppercase"
          >
            {day}
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`month-row-${rowIndex}`}
          role="row"
          tabIndex={0}
          className="flex flex-row w-full border-calendar-border basis-full overflow-hidden"
        >
          {visibleDates
            .slice(rowIndex * 7, (rowIndex + 1) * 7)
            .map((date, dayIndex) => {
              const isCurrentMonth = date.month === selectedDate.month;

              return (
                <MonthViewCell
                  key={`month-cell-${dayIndex}`}
                  date={date}
                  dayIndex={dayIndex}
                  isCurrentMonth={isCurrentMonth}
                />
              );
            })}
        </div>
      ))}
    </div>
  );
};
