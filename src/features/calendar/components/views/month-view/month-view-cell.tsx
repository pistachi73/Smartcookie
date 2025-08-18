"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-solid-rounded";
import { CalendarDate } from "@internationalized/date";
import { useEffect, useRef, useState } from "react";
import { useDrop } from "react-aria";
import { Button as AriaButton } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { Temporal } from "temporal-polyfill";

import { Button } from "@/shared/components/ui/button";
import { Popover } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";
import { getWeekdayAbbrev } from "@/shared/lib/temporal/format";

import { useOptimizedDaySessions } from "@/features/calendar/hooks/use-optimized-calendar-sessions";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { useCalendarDragDropStore } from "@/features/calendar/store/calendar-drag-drop-store";
import { useUpdateSession } from "@/features/hub/hooks/session/use-update-session";
import {
  MonthViewOccurrence,
  MonthViewPreviewOccurrence,
} from "./month-view-occurrence";

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
    isSelected: {
      true: "bg-primary-tint/50 before:absolute before:inset-0 before:border-1 before:border-primary before:pointer-events-none before:content-['']",
    },
    isDropTarget: {
      true: "bg-primary-tint/50",
    },
  },
  defaultVariants: {
    isCurrentMonth: true,
    isToday: false,
    isSelected: false,
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
  const cellRef = useRef<HTMLDivElement>(null);
  const { sessions } = useOptimizedDaySessions(date);

  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const selectDate = useCalendarStore((store) => store.selectDate);
  const set1DayView = useCalendarStore((store) => store.set1DayView);
  const setDefaultSessionFormData = useCalendarStore(
    (store) => store.setDefaultSessionFormData,
  );
  const setIsCreateSessionModalOpen = useCalendarStore(
    (store) => store.setIsCreateSessionModalOpen,
  );
  const { mutate: updateSession } = useUpdateSession();

  const sessionsContainerRef = useRef<HTMLDivElement>(null);

  const [visibleOccurrences, setVisibleOccurrences] = useState<number>(0);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);

  const { draggedSession, updateMonthViewDragPreview, endDrag } =
    useCalendarDragDropStore();
  const previewSession = useCalendarDragDropStore((state) =>
    state.getPreviewSession(date),
  );

  const { dropProps, isDropTarget } = useDrop({
    ref: cellRef,
    onDropMove: () => {
      updateMonthViewDragPreview(date);
    },
    onDrop: () => {
      if (!draggedSession || !previewSession) return;
      const { startTime, endTime } = previewSession;

      updateSession({
        sessionId: draggedSession.id,
        hubId: draggedSession.hub.id,
        data: {
          startTime,
          endTime,
          status: draggedSession.status,
          originalStartTime: draggedSession.startTime,
        },
      });

      setTimeout(() => {
        endDrag();
      }, 10);
    },
  });

  const totalOccurrences = sessions?.length ?? 0;
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
  }, [totalOccurrences, visibleOccurrences]);

  const isSelected = date.equals(selectedDate);

  const handleCellDoubleClick = () => {
    setDefaultSessionFormData({
      date: new CalendarDate(date.year, date.month, date.day),
      startTime: undefined,
      endTime: undefined,
    });
    setIsCreateSessionModalOpen(true);
  };

  return (
    <div
      ref={cellRef}
      {...dropProps}
      className={monthViewCellStyles({
        isCurrentMonth,
        dayIndex: dayIndex === 0 ? 0 : dayIndex === 6 ? 6 : undefined,
        isSelected,
        isDropTarget,
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
        onPress={() => selectDate(date)}
        onDoubleClick={handleCellDoubleClick}
      />
      <div
        ref={sessionsContainerRef}
        className="z-10 relative overflow-hidden grow p-0.5 sm:p-1 w-full space-y-1 pointer-events-none"
      >
        {previewSession && (
          <div className="absolute left-0 top-0 w-full h-full p-0.5 sm:p-1">
            <MonthViewPreviewOccurrence session={previewSession} />
          </div>
        )}
        {sessions?.slice(0, visibleOccurrences).map((session) => (
          <MonthViewOccurrence
            key={`month-session-${session.id}`}
            session={session}
            showTime={false}
          />
        ))}
        {visibleOccurrences < totalOccurrences && (
          <Popover
            isOpen={isViewAllOpen}
            onOpenChange={(open) => setIsViewAllOpen(open)}
          >
            <AriaButton
              onPress={() => {
                console.log("pressed");
              }}
              className="p-0.5 sm:p-1 px-1 text-left pointer-events-auto h-6 w-full hover:bg-secondary rounded-sm transition-colors text-xs font-medium"
            >
              {totalOccurrences - visibleOccurrences} more
            </AriaButton>
            <Popover.Content placement="bottom" className="sm:w-[300px]">
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
                    className="text-xs h-6 px-2 w-full"
                    popoverProps={{
                      offset: 8,
                      placement: "left top",
                    }}
                    showTime
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
