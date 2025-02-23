import { getMonthAbbrev, getWeekday } from "@/lib/temporal/format";
import { cn } from "@/lib/utils";

import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { getDayKeyFromDate } from "../../utils";
import { AgendaViewNoEvents } from "./agenda-view-no-events";
import { AgendaViewOccurrence } from "./agenda-view-occurrence";

export const AgendaViewDay = ({ date }: { date: Temporal.PlainDate }) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);

  const { dailyOccurrences, selectedDate } = useCalendarStore(
    useShallow((store) => ({
      selectedDate: store.selectedDate,
      dailyOccurrences: store.dailyOccurrencesGridPosition.get(dayKey),
    })),
  );

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
        {dailyOccurrences ? (
          dailyOccurrences.map((occurrence) => (
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
