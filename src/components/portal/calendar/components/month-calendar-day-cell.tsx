"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SessionOccurrence } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { MultiplicationSignIcon } from "@hugeicons/react";
import { format, isToday } from "date-fns";
import { m } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { SessionOccurrenceDetails } from "./session-occurrence-details";

type MonthCalendarDayCellProps = {
  dayIndex: number;
  rowIndex: number;
  currentDay: Date;
  isCurrentMonth: boolean;
  dayOccurrences: SessionOccurrence[][];
};

const SESSION_OCCURRENCE_HEIGHT = 24;
const SESSION_OCCURRENCE_SPACING = 8;

export const MonthCalendarDayCell = ({
  dayIndex,
  rowIndex,
  currentDay,
  isCurrentMonth,
  dayOccurrences,
}: MonthCalendarDayCellProps) => {
  const sessionsContainerRef = useRef<HTMLDivElement>(null);
  const totalOccurrences = dayOccurrences.flat().length * 2;
  const [visibleOccurrences, setVisibleOccurrences] =
    useState<number>(totalOccurrences);

  const flattenedDayOccurrences = useMemo(
    () => dayOccurrences.flat(),
    [dayOccurrences],
  );

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
        "flex flex-col items-center h-full w-full border overflow-hidden pt-1",
        isCurrentMonth ? "" : "",
        dayIndex === 0 && "border-l-0",
        dayIndex === 6 && "border-r-0",
      )}
    >
      {rowIndex === 0 && (
        <span className="text-sm text-neutral-500 lowercase">
          {format(currentDay, "iii")}
        </span>
      )}

      <span
        className={cn(
          "text-sm font-medium mb-2 size-6 rounded-full flex items-center justify-center",
          isCurrentMonth ? "text-responsive-dark" : "text-neutral-500",
          isToday(currentDay) && "bg-primary text-light",
        )}
      >
        {currentDay.getDate()}
      </span>
      <div ref={sessionsContainerRef} className="overflow-hidden grow p-1">
        <div className="h-full w-full space-y-2">
          {[...flattenedDayOccurrences, ...flattenedDayOccurrences]
            .slice(0, visibleOccurrences)
            .map((occurrence, index) => (
              <MonthOcccurrence
                key={`${occurrence.id}-${index}`}
                occurrence={occurrence}
              />
            ))}
          {visibleOccurrences < totalOccurrences && (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full hover:bg-neutral-500/30 rounded-md transition-colors text-sm">
                {totalOccurrences - visibleOccurrences} more
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                side="top"
                sideOffset={-48}
                className="w-[300px] p-4 space-y relative"
              >
                <Button
                  variant="ghost"
                  iconOnly
                  className="absolute top-2 right-2 size-8 shrink-0"
                >
                  <MultiplicationSignIcon size={20} />
                </Button>
                <div className="flex flex-col items-center justify-center mb-4">
                  <p className="text-sm text-neutral-500 lowercase">
                    {format(currentDay, "iii")}
                  </p>
                  <p className="text-4xl font-medium text-responsive-dark ">
                    {currentDay.getDate()}
                  </p>
                </div>
                <div className="space-y-2">
                  {[...flattenedDayOccurrences, ...flattenedDayOccurrences].map(
                    (occurrence, index) => (
                      <MonthOcccurrence
                        key={`${occurrence.id}-${index}`}
                        occurrence={occurrence}
                      />
                    ),
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export const MonthOccurrenceDropdown = ({
  occurrence,
  isOpen,
  setIsOpen,
}: {
  occurrence: SessionOccurrence;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <MotionDropdownMenuContent
        className="w-full p-0"
        align="center"
        side="left"
        sideOffset={8}
        layoutId="session-occurrence-details"
      >
        <SessionOccurrenceDetails occurrence={occurrence} />
      </MotionDropdownMenuContent>
    </DropdownMenu>
  );
};

const MonthOcccurrence = ({
  occurrence,
}: {
  occurrence: SessionOccurrence;
}) => {
  return (
    <DropdownMenu modal={false}>
      {/* <DropdownMenuTrigger className="h-6 p-0.5 px-1 rounded-md text-dark text-sm hover:bg-neutral-500/30 flex gap-2 items-center transition-colors cursor-pointer">
        <div className="size-2 bg-lime-300 rounded-full shrink-0" />
        <p className="line-clamp-1 text-left text-responsive-dark">
          <span>{format(occurrence.startTime, "HH:mm")}</span> -{" "}
          {occurrence.title}
        </p>
      </DropdownMenuTrigger> */}
      <MotionDropdownMenuContent
        className="w-full p-0"
        align="center"
        side="left"
        sideOffset={8}
        layoutId="session-occurrence-details"
      >
        <SessionOccurrenceDetails occurrence={occurrence} />
      </MotionDropdownMenuContent>
    </DropdownMenu>
  );
};

const MotionDropdownMenuContent = m(DropdownMenuContent);
