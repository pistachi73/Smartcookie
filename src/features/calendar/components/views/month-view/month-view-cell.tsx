"use client";

import { getDayKeyFromDate } from "@/features/calendar/lib/utils";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { Popover } from "@/shared/components/ui";
import { cn } from "@/shared/lib/classes";
import { getWeekdayAbbrev } from "@/shared/lib/temporal/format";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Temporal } from "@js-temporal/polyfill";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { MonthViewOccurrence } from "./month-view-occurrence";

type MonthCalendarDayCellProps = {
  date: Temporal.PlainDate;
  dayIndex: number;
  rowIndex: number;
  isCurrentMonth: boolean;
};

const SESSION_OCCURRENCE_HEIGHT = 24 + 1;
const SESSION_OCCURRENCE_SPACING = 4;

export const MonthViewCell = ({
  dayIndex,
  date,
  isCurrentMonth,
}: MonthCalendarDayCellProps) => {
  const dayKey = useMemo(() => getDayKeyFromDate(date), [date]);

  const { selectedDate, layoutOccurrences, updateLayoutCache } =
    useCalendarStore(
      useShallow((store) => ({
        selectedDate: store.selectedDate,
        layoutOccurrences: store.getLayoutOccurrences(dayKey),
        updateLayoutCache: store.updateLayoutCache,
      })),
    );

  const sessionsContainerRef = useRef<HTMLDivElement>(null);

  const totalOccurrences = layoutOccurrences?.length ?? 0;

  const [visibleOccurrences, setVisibleOccurrences] =
    useState<number>(totalOccurrences);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0] as ResizeObserverEntry;
      const sessionContainerHeight =
        entry.target.getBoundingClientRect().height;

      const visibleSessions = Math.floor(
        sessionContainerHeight /
          (SESSION_OCCURRENCE_HEIGHT + SESSION_OCCURRENCE_SPACING),
      );

      setVisibleOccurrences(visibleSessions);
    });

    if (sessionsContainerRef.current) {
      observer.observe(sessionsContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Update the cache outside of render
    if (layoutOccurrences) {
      updateLayoutCache(dayKey, layoutOccurrences);
    }
  }, [dayKey, layoutOccurrences, updateLayoutCache]);

  const isToday = date.day === Temporal.Now.plainDateISO().day;
  const isSelectedDate = date.day === selectedDate.day;

  return (
    <div
      className={cn(
        "flex flex-col items-center h-full w-full border-r border-t overflow-hidden pt-1",
        isCurrentMonth ? "" : "bg-lines-pattern",
        dayIndex === 0 && "border-l-0",
        dayIndex === 6 && "border-r-0",
        isSelectedDate && "bg-primary/10  text-light",
      )}
    >
      <span
        className={cn(
          "text-xs font-medium size-5 rounded-full flex items-center justify-center",
          isCurrentMonth ? "text-current" : "text-muted-fg",
          isToday && "bg-primary text-light",
        )}
      >
        {date.day}
      </span>
      <div
        ref={sessionsContainerRef}
        className="mt-1 overflow-hidden grow p-1 w-full space-y-1"
      >
        {layoutOccurrences?.slice(0, visibleOccurrences).map((occurrence) => (
          <MonthViewOccurrence
            key={`event-ocurrence-${occurrence.occurrenceId}`}
            occurrenceId={occurrence.occurrenceId}
          />
        ))}

        {visibleOccurrences < totalOccurrences && (
          <Popover
            isOpen={isViewAllOpen}
            onOpenChange={(open) => setIsViewAllOpen(open)}
          >
            <AriaButton className="h-6 w-full hover:bg-overlay-highlight rounded-md transition-colors text-xs">
              {totalOccurrences - visibleOccurrences} more
            </AriaButton>
            <Popover.Content
              placement="top"
              className="w-[300px] relative overflow-visible"
            >
              <Popover.Close
                appearance="plain"
                size="square-petite"
                className="absolute top-1 right-1 size-8 shrink-0"
              >
                <HugeiconsIcon icon={MultiplicationSignIcon} size={16} />
              </Popover.Close>
              <Popover.Header className="flex flex-col items-center justify-center">
                <p className="text-sm text-text-sub lowercase">
                  {getWeekdayAbbrev(date)}
                </p>
                <p className="text-3xl font-medium text-responsive-dark ">
                  {date.day}
                </p>
              </Popover.Header>
              <Popover.Body className="space-y-1 w-full pb-4">
                {layoutOccurrences?.map((occurrence) => (
                  <MonthViewOccurrence
                    key={`event-ocurrence-${occurrence.occurrenceId}`}
                    occurrenceId={occurrence.occurrenceId}
                    className="text-sm h-7 px-2 w-full"
                    popoverProps={{
                      offset: 30,
                      placement: "left top",
                      className: "brightness-125",
                    }}
                    onEditPress={() => {
                      setIsViewAllOpen(false);
                    }}
                  />
                ))}
              </Popover.Body>
            </Popover.Content>
          </Popover>
        )}
      </div>
    </div>
  );
};
