import { cn } from "@/shared/lib/classes";
import { getMonthAbbrev, getWeekday } from "@/shared/lib/temporal/format";

import { getDayKeyFromDate } from "@/features/calendar/lib/utils";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import type { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { AgendaViewNoEvents } from "./agenda-view-no-events";
import { AgendaViewOccurrence } from "./agenda-view-occurrence";

export const AgendaViewDay = ({ date }: { date: Temporal.PlainDate }) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);

  const { layoutOccurrences, selectedDate, updateLayoutCache } =
    useCalendarStore(
      useShallow((store) => ({
        selectedDate: store.selectedDate,
        layoutOccurrences: store.getLayoutOccurrences(dayKey),
        updateLayoutCache: store.updateLayoutCache,
      })),
    );

  useEffect(() => {
    // Update the cache outside of render
    if (layoutOccurrences) {
      updateLayoutCache(dayKey, layoutOccurrences);
    }
  }, [dayKey, layoutOccurrences, updateLayoutCache]);

  const isToday = selectedDate.dayOfYear === date.dayOfYear;
  return (
    <div key={date.toString()} className="h-full flex gap-2">
      <div
        className={cn(
          "rounded-lg w-30 bg-overlay-highlight p-3 px-4",
          isToday && "bg-primary/40",
        )}
      >
        <p className="text-xl font-semibold text-current leading-tight">
          {getMonthAbbrev(date)} {date.day}
        </p>
        <p className="text-sm text-muted-fg">{getWeekday(date)}</p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {layoutOccurrences && layoutOccurrences.length > 0 ? (
          layoutOccurrences.map((occurrence) => (
            <AgendaViewOccurrence
              key={`event-occurrence-${occurrence.occurrenceId}`}
              occurrenceId={occurrence.occurrenceId}
            />
          ))
        ) : (
          <AgendaViewNoEvents />
        )}
      </div>
    </div>
  );
};
