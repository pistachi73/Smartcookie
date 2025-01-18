"use client";

import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/react-aria/popover";
import type { EventOccurrence } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { MultiplicationSignIcon } from "@hugeicons/react";
import { format, isToday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Button as AriaButton,
  Dialog,
  DialogTrigger,
} from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { MonthViewOccurrence } from "./month-view-occurrence";

type MonthCalendarDayCellProps = {
  dayIndex: number;
  rowIndex: number;
  currentDay: Date;
  isCurrentMonth: boolean;
  dayOccurrences?: EventOccurrence[][];
};

const SESSION_OCCURRENCE_HEIGHT = 24 + 1;
const SESSION_OCCURRENCE_SPACING = 4;

const useMonthViewCell = () =>
  useCalendarStore(
    useShallow(({ selectedDate, handleCalendarColumnDoubleClick }) => ({
      handleCalendarColumnDoubleClick,
    })),
  );

export const MonthViewCell = ({
  dayIndex,
  rowIndex,
  currentDay,
  isCurrentMonth,
  dayOccurrences,
}: MonthCalendarDayCellProps) => {
  const { handleCalendarColumnDoubleClick } = useMonthViewCell();
  const sessionsContainerRef = useRef<HTMLDivElement>(null);
  const flattenedDayOccurrences = dayOccurrences?.flat() || [];
  const totalOccurrences = flattenedDayOccurrences.length;
  const [visibleOccurrences, setVisibleOccurrences] =
    useState<number>(totalOccurrences);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0] as ResizeObserverEntry;
      const sessionContainerHeight =
        entry.target.getBoundingClientRect().height;

      console.log({ sessionContainerHeight });

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

  return (
    <div
      className={cn(
        "flex flex-col items-center h-full w-full border-r border-t overflow-hidden pt-1",
        isCurrentMonth ? "" : "",
        dayIndex === 0 && "border-l-0",
        dayIndex === 6 && "border-r-0",
      )}
      onDoubleClick={(e) => {
        handleCalendarColumnDoubleClick(e, currentDay);
      }}
    >
      {rowIndex === 0 && (
        <span className="text-xs text-text-sub lowercase">
          {format(currentDay, "iii")}
        </span>
      )}

      <span
        className={cn(
          "text-xs font-medium size-5 rounded-full flex items-center justify-center",
          isCurrentMonth ? "text-responsive-dark" : "text-text-sub",
          isToday(currentDay) && "bg-primary text-light",
        )}
      >
        {currentDay.getDate()}
      </span>
      <div ref={sessionsContainerRef} className="mt-1 overflow-hidden grow p-1">
        {flattenedDayOccurrences
          .slice(0, visibleOccurrences)
          .map((occurrence) => (
            <MonthViewOccurrence
              key={`event-ocurrence-${occurrence.eventOccurrenceId}`}
              occurrence={occurrence}
            />
          ))}
        {visibleOccurrences < totalOccurrences && (
          <DialogTrigger>
            <AriaButton className="h-6 w-full hover:bg-base-highlight rounded-md transition-colors text-xs">
              {totalOccurrences - visibleOccurrences} more
            </AriaButton>
            <Popover
              placement="top"
              offset={-48}
              className="w-[300px] p-4 px-3 relative overflow-hidden"
            >
              <Dialog className="overflow-hidden">
                <Button
                  variant="ghost"
                  slot="close"
                  iconOnly
                  className="absolute top-1 right-1 size-8 shrink-0"
                >
                  <MultiplicationSignIcon size={16} />
                </Button>
                <div className="flex flex-col items-center justify-center mb-4">
                  <p className="text-sm text-text-sub lowercase">
                    {format(currentDay, "iii")}
                  </p>
                  <p className="text-3xl font-medium text-responsive-dark ">
                    {currentDay.getDate()}
                  </p>
                </div>
                <div className="space-y-1">
                  {flattenedDayOccurrences.map((occurrence, index) => (
                    <MonthViewOccurrence
                      key={`event-ocurrence-${occurrence.eventOccurrenceId}`}
                      occurrence={occurrence}
                      className="text-sm h-7 px-2"
                    />
                  ))}
                </div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        )}
      </div>
    </div>
  );
};
