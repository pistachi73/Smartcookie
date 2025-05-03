"use client";

import { useCalendarDay } from "@/features/calendar/hooks/use-calendar-sessions";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { cn } from "@/shared/lib/classes";
import { getWeekdayAbbrev } from "@/shared/lib/temporal/format";
import { Popover } from "@/ui/popover";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import type { Temporal } from "temporal-polyfill";
import { MonthViewOccurrence } from "./month-view-occurrence";

type MonthCalendarDayCellProps = {
  date: Temporal.PlainDate;
  dayIndex: number;
  isCurrentMonth: boolean;
};

const SESSION_OCCURRENCE_HEIGHT = 24 + 1;
const SESSION_OCCURRENCE_SPACING = 4;

export const MonthViewCell = ({
  dayIndex,
  date,
  isCurrentMonth,
}: MonthCalendarDayCellProps) => {
  const { sessions } = useCalendarDay(date);

  const selectedDate = useCalendarStore((store) => store.selectedDate);

  const sessionsContainerRef = useRef<HTMLDivElement>(null);

  const totalOccurrences = sessions?.length ?? 0;

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

  const isSelectedDate =
    date.day === selectedDate.day && date.month === selectedDate.month;

  return (
    <div
      className={cn(
        "flex flex-col items-center h-full w-full border-r border-t overflow-hidden pt-1",
        isCurrentMonth ? "" : "bg-lines-pattern",
        dayIndex === 0 && "border-l-0",
        dayIndex === 6 && "border-r-0",
        isSelectedDate && "bg-primary-tint  text-light",
      )}
    >
      <div className="w-full flex items-start px-1">
        <p
          className={cn(
            "w-full text-xs font-medium tabular-nums",
            isCurrentMonth ? "text-current" : "text-muted-fg",
          )}
        >
          {date.day.toString().padStart(2, "0")}
        </p>
      </div>
      <div
        ref={sessionsContainerRef}
        className="overflow-hidden grow p-1 w-full space-y-1"
      >
        {sessions?.slice(0, visibleOccurrences).map((session) => (
          <MonthViewOccurrence
            key={`month-session-${session.id}`}
            session={session}
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
                intent="plain"
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
                {sessions?.map((session) => (
                  <MonthViewOccurrence
                    key={`month-session-${session.id}`}
                    session={session}
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
