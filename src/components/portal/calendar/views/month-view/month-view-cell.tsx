"use client";

import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format, isToday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type MonthCalendarDayCellProps = {
  dayIndex: number;
  rowIndex: number;
  currentDay: Date;
  isCurrentMonth: boolean;
  dayOccurrences?: SessionOccurrence[][];
};

const SESSION_OCCURRENCE_HEIGHT = 24;
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
  const totalOccurrences = 2;
  //   const totalOccurrences = 5 ?? dayOccurrences.flat().length;
  const [visibleOccurrences, setVisibleOccurrences] =
    useState<number>(totalOccurrences);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0] as ResizeObserverEntry;
      const sessionContainerHeight =
        entry.target.getBoundingClientRect().height;

      const visibleSessions = Math.floor(
        sessionContainerHeight /
          (SESSION_OCCURRENCE_HEIGHT + SESSION_OCCURRENCE_SPACING),
      );

      setVisibleOccurrences(visibleSessions - 1);
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
      <div ref={sessionsContainerRef} className="overflow-hidden grow p-1">
        <div className="flex flex-col">
          {/* {flattenedDayOccurrences
            .slice(0, visibleOccurrences)
            .map((occurrence, index) => (
              <MonthViewOccurrence
                key={`${occurrence.id}-${index}`}
                occurrence={occurrence}
              />
            ))} */}
          {/* {visibleOccurrences < totalOccurrences && (
            <DialogTrigger>
              <AriaButton className="w-full hover:bg-base-highlight rounded-md transition-colors text-sm">
                {totalOccurrences - visibleOccurrences} more
              </AriaButton>
              <Popover
                placement="top"
                offset={-48}
                className="w-[300px] p-4 relative overflow-hidden"
              >
                <Dialog className="overflow-hidden">
                  <Button
                    variant="ghost"
                    slot="close"
                    iconOnly
                    className="absolute top-2 right-2 size-8 shrink-0"
                  >
                    <MultiplicationSignIcon size={20} />
                  </Button>
                  <div className="flex flex-col items-center justify-center mb-4">
                    <p className="text-sm text-text-sub lowercase">
                      {format(currentDay, "iii")}
                    </p>
                    <p className="text-4xl font-medium text-responsive-dark ">
                      {currentDay.getDate()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {flattenedDayOccurrences.map((occurrence, index) => (
                      <MonthOcccurrence
                        key={occurrence.id}
                        occurrence={occurrence}
                      />
                    ))}
                  </div>
                </Dialog>
              </Popover>
            </DialogTrigger>
          )} */}
        </div>
      </div>
    </div>
  );
};
