import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { CalendarStore } from "@/stores/calendar-store/calendar-store.types";
import type { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useRef } from "react";
import { HourMarker } from "../../components/hour-marker";
import { getDayKeyFromDate } from "../../utils";
import { DayViewOccurrence } from "./day-view-occurrence";
import { DragToCreateEvent } from "./drag-to-create-event";

const createLayoutSelector = (dayKey: string) => (state: CalendarStore) =>
  state.getLayoutOccurrences(dayKey);

const updateLayoutCacheSelector = (state: CalendarStore) => state.updateLayoutCache;

export const DayColumn = ({ date }: { date: Temporal.PlainDate }) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);
  const selector = useMemo(() => createLayoutSelector(dayKey), [dayKey]);
  const layoutOccurrences = useCalendarStore(selector);
  const updateLayoutCache = useCalendarStore(updateLayoutCacheSelector);
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
