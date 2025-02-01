import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { addDays, isToday as dfnsIsToday, format } from "date-fns";
import { useShallow } from "zustand/react/shallow";
import { getEventOccurrenceDayKey } from "../../utils";
import { AgendaViewNoEvents } from "./agenda-view-no-events";
import { AgendaViewOccurrence } from "./agenda-view-occurrence";

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
            groupedEventOccurrences[getEventOccurrenceDayKey(currentDay)] || [];

          return (
            <div key={currentDay.getTime()} className="h-full flex gap-2">
              <div
                className={cn(
                  "rounded-lg w-30 bg-overlay-highlight p-3 px-4",
                  isToday && "bg-primary/40",
                )}
              >
                <p className="text-lg font-medium text-text-default leading-tight">
                  {format(currentDay, "MMM")} {currentDay.getDate()}
                </p>
                <p className="text-sm text-text-sub">
                  {format(currentDay, "iiii")}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full">
                {dayOccurrences.length ? (
                  dayOccurrences.map((occurrence) => {
                    if (occurrence.isDraft) return null;
                    return (
                      <AgendaViewOccurrence
                        key={`event-occurrence-${occurrence.eventOccurrenceId}`}
                        occurrence={occurrence}
                      />
                    );
                  })
                ) : (
                  <AgendaViewNoEvents />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
