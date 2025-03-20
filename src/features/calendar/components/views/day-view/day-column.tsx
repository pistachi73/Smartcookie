import { getDayKeyFromDate } from "@/features/calendar/lib/utils";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import type { CalendarStore } from "@/features/calendar/types/calendar-store.types";
import { cn } from "@/shared/lib/classes";
import type { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useRef } from "react";
import { DayViewOccurrence } from "./day-view-occurrence";
import { DragToCreateEvent } from "./drag-to-create-event";
import { HourMarker } from "./hour-marker";

const createLayoutSelector = (dayKey: string) => (state: CalendarStore) =>
  state.getLayoutOccurrences(dayKey);

const updateLayoutCacheSelector = (state: CalendarStore) =>
  state.updateLayoutCache;

export const DayColumn = ({ date }: { date: Temporal.PlainDate }) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);
  const layoutOccurrences = useCalendarStore((state) =>
    state.getLayoutOccurrences(dayKey),
  );
  const updateLayoutCache = useCalendarStore(
    (state) => state.updateLayoutCache,
  );
  const hasUpdatedCacheRef = useRef(false);

  useEffect(() => {
    hasUpdatedCacheRef.current = false;

    return () => {
      hasUpdatedCacheRef.current = false;
    };
  }, [dayKey]);

  useEffect(() => {
    if (layoutOccurrences && !hasUpdatedCacheRef.current) {
      updateLayoutCache(dayKey, layoutOccurrences);
      hasUpdatedCacheRef.current = true;
    }
  }, [dayKey, layoutOccurrences, updateLayoutCache]);

  return (
    <div className={cn("h-full w-full relative")}>
      <DragToCreateEvent date={date} />
      <HourMarker date={date} />

      {layoutOccurrences?.map((occurrence) => (
        <DayViewOccurrence
          key={`occurrence-${occurrence.occurrenceId}`}
          occurrenceId={occurrence.occurrenceId}
          columnIndex={occurrence.columnIndex}
          totalColumns={occurrence.totalColumns}
        />
      ))}
    </div>
  );
};
