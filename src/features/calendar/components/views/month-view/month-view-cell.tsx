"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-solid-rounded";
import { CalendarDate } from "@internationalized/date";
import { useEffect, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Temporal } from "temporal-polyfill";

import { Button } from "@/shared/components/ui/button";
import { Popover } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";
import { getWeekdayAbbrev } from "@/shared/lib/temporal/format";

import { useOptimizedDaySessions } from "@/features/calendar/hooks/use-optimized-calendar-sessions";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { MonthViewOccurrence } from "./month-view-occurrence";

export const monthViewCellStyles = tv({
  base: [
    "relative flex flex-col items-center h-full w-full border-r border-t overflow-hidden pt-1",
  ],
  variants: {
    isCurrentMonth: {
      true: "",
      false: "bg-muted/80",
    },
    dayIndex: {
      0: "border-l-0",
      6: "border-r-0",
    },
    isToday: {
      true: "bg-primary-tint",
    },
  },
  defaultVariants: {
    isCurrentMonth: true,
    isToday: false,
  },
});

type MonthCalendarDayCellProps = {
  date: Temporal.PlainDate;
  dayIndex: number;
  isCurrentMonth: boolean;
};

const SESSION_OCCURRENCE_HEIGHT = 24;
const SESSION_OCCURRENCE_SPACING = 4;

export const MonthViewCell = ({
  dayIndex,
  date,
  isCurrentMonth,
}: MonthCalendarDayCellProps) => {
  const { sessions } = useOptimizedDaySessions(date);

  const set1DayView = useCalendarStore((store) => store.set1DayView);
  const setDefaultSessionFormData = useCalendarStore(
    (store) => store.setDefaultSessionFormData,
  );
  const setIsCreateSessionModalOpen = useCalendarStore(
    (store) => store.setIsCreateSessionModalOpen,
  );

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

      if (visibleOccurrences === totalOccurrences) {
        setVisibleOccurrences(visibleSessions);
      } else {
        setVisibleOccurrences(visibleSessions - 1);
      }
    });

    if (sessionsContainerRef.current) {
      observer.observe(sessionsContainerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const isToday = date.equals(Temporal.Now.plainDateISO());

  const handleCellClick = () => {
    setDefaultSessionFormData({
      date: new CalendarDate(date.year, date.month, date.day),
      startTime: undefined,
      endTime: undefined,
    });
    setIsCreateSessionModalOpen(true);
  };

  return (
    <div
      className={monthViewCellStyles({
        isCurrentMonth,
        dayIndex: dayIndex === 0 ? 0 : dayIndex === 6 ? 6 : undefined,
        isToday,
      })}
    >
      <div className="relative z-10 w-full flex items-start px-1">
        <Button
          size="square-petite"
          intent="plain"
          className={cn(
            "size-fit p-0.5 text-xs font-medium tabular-nums cursor-pointer ",
            isCurrentMonth ? "text-current" : "text-muted-fg",
          )}
          onPress={() => set1DayView(date)}
        >
          {date.day.toString().padStart(2, "0")}
        </Button>
      </div>
      <AriaButton
        aria-label={`Create session on ${date.toString()}`}
        className={cn(
          "absolute z-0 top-0 right-0 w-full h-full",
          "focus-visible:bg-primary-tint/80",
        )}
        onPress={handleCellClick}
      />
      <div
        ref={sessionsContainerRef}
        className="z-10 relative overflow-hidden grow p-0.5 sm:p-1 w-full space-y-1 pointer-events-none"
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
              respectScreen={false}
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
                      offset: 8,
                      placement: "left top",
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
