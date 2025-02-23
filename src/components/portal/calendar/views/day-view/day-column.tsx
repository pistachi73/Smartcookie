import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { HourMarker } from "../../components/hour-marker";
import { getDayKeyFromDate } from "../../utils";
import { DayViewOccurrence } from "./day-view-occurrence";
import { DragToCreateEvent } from "./drag-to-create-event";

export const DayColumn = ({
  date,
}: {
  date: Temporal.PlainDate;
}) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);

  const dailyOccurrences = useCalendarStore(
    useShallow((store) => store.dailyOccurrencesGridPosition.get(dayKey)),
  );

  console.log({ dailyOccurrences });

  return (
    <div className={cn("h-full w-full relative")}>
      <HourMarker date={date} />
      <DragToCreateEvent date={date} />

      {dailyOccurrences?.map((occurrence) => (
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
