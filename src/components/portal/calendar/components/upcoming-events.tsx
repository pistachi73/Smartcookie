import { ArrowRight02Icon, Clock02Icon } from "@hugeicons/react";
import { Temporal } from "@js-temporal/polyfill";
import { useMemo } from "react";

import type { MergedOccurrence } from "../calendar.types";
import { getCalendarColor, getDayKeyFromDate } from "../utils";

import { Heading } from "@/components/ui/new/ui";

import { get24HourTime, getMonthAbbrev } from "@/lib/temporal/format";
import { cn } from "@/lib/utils";

import { useCalendarStore } from "@/providers/calendar-store-provider";
import { mergeEventAndOccurrence } from "@/stores/calendar-store";
import { useShallow } from "zustand/react/shallow";

export const UpcomingEvents = () => {
  const now = Temporal.Now.plainDateTimeISO();

  const upcomingOccurrenceIds = useCalendarStore(
    useShallow((store) =>
      store.dailyOccurrencesIds.get(getDayKeyFromDate(now)),
    ),
  );
  const occurrences = useCalendarStore(
    useShallow((store) => store.occurrences),
  );
  const events = useCalendarStore(useShallow((store) => store.events));

  const upcomingOccurrences = useMemo(() => {
    const nowPlainTime = Temporal.Now.plainTimeISO();
    const upcomingOccurrences: MergedOccurrence[] = [];
    if (!upcomingOccurrenceIds?.size) return [];

    for (const upcomingOccurrenceId of upcomingOccurrenceIds) {
      if (upcomingOccurrenceId === -1) continue;
      const occurrence = occurrences.get(upcomingOccurrenceId);

      if (!occurrence) continue;

      const event = events.get(occurrence.eventId);

      if (!event) continue;

      const mergedOccurrence = mergeEventAndOccurrence({
        event,
        occurrence,
      });

      if (
        Temporal.PlainTime.compare(
          mergedOccurrence.startTime.toPlainTime(),
          nowPlainTime,
        ) > 0
      ) {
        upcomingOccurrences.push(mergedOccurrence);
      }
    }

    return upcomingOccurrences;
  }, [events, occurrences, upcomingOccurrenceIds]);

  return (
    <div className="flex flex-col gap-3 relative items-stretch">
      <div className="flex flex-row items-center gap-3 p-2">
        <div className="flex flex-col items-center bg-overlay rounded-sm border-fg/25 border overflow-hidden ">
          <p className="text-xs bg-overlay-highlight px-3 py-0.5 text-muted-fg">
            {getMonthAbbrev(now)}
          </p>
          <p className="py-0.5  font-semibold">
            {String(now.day).padStart(2, "0")}
          </p>
        </div>
        <div>
          <Heading level={4}>Upcoming Events</Heading>
          <p className="text-sm text-muted-fg">Don’t miss scheduled events</p>
        </div>
      </div>

      <div className="space-y-2">
        {upcomingOccurrences.slice(0, 3).map((occurrence) => (
          <UpcomingOccurrenceCard
            key={`upcoming-occurrence-${occurrence.occurrenceId}`}
            occurrence={occurrence}
          />
        ))}
      </div>
    </div>
  );
};

const UpcomingOccurrenceCard = ({
  occurrence,
}: { occurrence: MergedOccurrence }) => {
  const color = getCalendarColor(occurrence.color);

  return (
    <div
      key={`upcoming-event-${occurrence.occurrenceId}`}
      className={cn(
        "bg-overlay-elevated",
        "relative h-full w-full flex items-stretch rounded-md gap-3 pl-1 pr-2",
        "hover:bg-secondary cursor-pointer",
      )}
    >
      <div
        className={cn(
          "my-1 rounded-lg w-1 shrink-0 min-w-0 min-h-0 border",
          color?.className,
        )}
      />
      <div
        className={cn("text-left flex flex-col gap-0 justify-between py-2.5")}
      >
        <div className="flex flex-row items-center gap-1.5">
          <Clock02Icon size={12} variant="stroke" />
          <div className="flex items-center gap-1 text-xs text-muted-fg">
            {get24HourTime(occurrence.startTime)}
            <ArrowRight02Icon size={14} />
            {get24HourTime(occurrence.endTime)}
          </div>
        </div>
        <p className="text-sm line-clamp-2 font-normal leading-tight">
          {occurrence.title ?? "Untitled"}
        </p>
      </div>
    </div>
  );
};
