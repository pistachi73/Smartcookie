import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { addDays, isToday as dfnsIsToday, format } from "date-fns";
import { useShallow } from "zustand/react/shallow";

const useAgendaView = () =>
  useCalendarStore(
    useShallow(({ selectedDate, groupedEventOccurrences }) => ({
      selectedDate,
      groupedEventOccurrences,
    })),
  );

export const AgendaView = () => {
  const { selectedDate, groupedEventOccurrences } = useAgendaView();

  return (
    <div className="h-full overflow-y-scroll pl-[var(--left-spacing)] pr-2 pb-[var(--left-spacing)]">
      <div className="space-y-2 ">
        {Array.from({ length: 14 }).map((_, dayIndex) => {
          const currentDay = addDays(selectedDate, dayIndex);
          const isToday = dfnsIsToday(currentDay);
          const dayOccurrences =
            groupedEventOccurrences?.[format(currentDay, "yyyy-MM-dd")] || [];

          return (
            <div key={currentDay.getTime()} className="h-full flex gap-2">
              <div
                className={cn(
                  "rounded-lg w-30 bg-base-highlight p-3 px-4",
                  isToday && "bg-primary/40",
                )}
              >
                <p className="text-lg font-medium text-text-base leading-tight">
                  {format(currentDay, "MMM")} {currentDay.getDate()}
                </p>
                <p className="text-sm text-text-sub">
                  {format(currentDay, "iiii")}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                {dayOccurrences.length ? (
                  dayOccurrences.flat().map((occurrence) => {
                    return (
                      <div
                        key={`event-occurrence-${occurrence.eventOccurrenceId}`}
                        className={cn(
                          "relative h-full w-full border brightness-100 flex items-center rounded-md gap-2 px-1 transition-colors",
                          "hover:bg-base-highlight cursor-pointer",
                        )}
                      >
                        <div className="h-[calc(100%-8px)] rounded-lg w-0.5 bg-[#286552] shrink-0 min-w-0 min-h-0 " />
                        <div className="flex flex-col gap-0.5 justify-between py-3 pr-2">
                          <p className="text-sm line-clamp-2 font-normal leading-tight mb-0.5">
                            {occurrence.title}
                          </p>
                          <span className="text-xs line-clamp-1 text-text-sub">
                            {format(occurrence.startTime, "HH:mm")} -{" "}
                            {format(occurrence.endTime, "HH:mm")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-border/50 h-full rounded-lg flex items-center px-4">
                    <span className="text-sm text-text-sub opacity-70">
                      No events
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
