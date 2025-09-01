"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { getLocalTimeZone, today } from "@internationalized/date";
import { addMinutes } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { Button as RAButton } from "react-aria-components";
import { Temporal } from "temporal-polyfill";

import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getCustomColorClasses } from "@/shared/lib/custom-colors";
import { cn } from "@/shared/lib/utils";

import { useCurrentTime } from "@/features/calendar/hooks/use-current-time";
import {
  useOptimizedCalendarSessions,
  useOptimizedDaySessions,
} from "@/features/calendar/hooks/use-optimized-calendar-sessions";
import {
  calculateSessionLeft,
  getFilteredSession,
  getSessionsWithPositions,
  getSessionTimeStatus,
} from "./utils";

export const HOURS = Array.from({ length: 25 }, (_, i) => i);

interface SessionsWidgetProps {
  hubIds?: number[];
}

export function SessionsWidget({ hubIds }: SessionsWidgetProps) {
  const [focusedSessionIndex, setFocusedSessionIndex] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { now } = useCurrentTime();

  const currentDate = Temporal.PlainDate.from(
    today(getLocalTimeZone()).toString(),
  );

  useOptimizedCalendarSessions({
    viewType: "day",
    date: currentDate,
  });

  const { sessions, isLoading } = useOptimizedDaySessions(currentDate);

  const nowLeft = calculateSessionLeft(addMinutes(now, 30));
  const filteredSessions = getFilteredSession(sessions, hubIds);
  const sessionPositions = getSessionsWithPositions(filteredSessions);
  const timeToSession = getSessionTimeStatus(
    filteredSessions,
    focusedSessionIndex,
    now,
  );

  // Navigation functions
  const focusNextSession = () => {
    if (sessionPositions.length === 0) return;

    const nextIndex =
      focusedSessionIndex === null
        ? 0
        : Math.min(focusedSessionIndex + 1, sessionPositions.length - 1);

    setFocusedSessionIndex(nextIndex);
  };

  const focusPreviousSession = () => {
    if (sessionPositions.length === 0) return;

    const prevIndex =
      focusedSessionIndex === null
        ? sessionPositions.length - 1
        : Math.max(focusedSessionIndex - 1, 0);

    setFocusedSessionIndex(prevIndex);
  };

  useEffect(() => {
    if (focusedSessionIndex !== null && timelineRef.current) {
      const sessionPosition = sessionPositions[focusedSessionIndex];
      if (sessionPosition) {
        const paddingPixels = 40; // Padding from the left edge
        const scrollLeft = Math.max(0, sessionPosition.left - paddingPixels);
        timelineRef.current.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [focusedSessionIndex, sessionPositions]);

  return (
    <div
      className={cn(
        "w-full bg-white rounded-lg border pt-4",
        "[--timeline-width:1600px]",
        "[--timeline-height:80px]",
        "[--timeline-hour-width:calc(var(--timeline-width)/24)]",
        "[--timeline-margin-top:20px]",
      )}
    >
      <div
        ref={timelineRef}
        className="overflow-x-auto flex items-center relative no-scrollbar"
      >
        <div
          className={cn(
            "absolute flex items-center top-[var(--timeline-margin-top)] z-30",
          )}
          style={{
            left: nowLeft,
          }}
        >
          <div className="size-1 absolute -top-2 left-[-4px] text-primary">
            <HugeiconsIcon icon={ArrowDown01Icon} size={10} />
          </div>
          <div
            className={cn(
              "w-px h-[calc(var(--timeline-height)-var(--timeline-margin-top))] border-[0.5px] border-dashed border-primary",
            )}
          />
        </div>

        {HOURS.map((hour) => (
          <div
            key={hour}
            className={cn(
              "relative flex flex-col gap-1 items-center w-[var(--timeline-hour-width)] h-[var(--timeline-height)] shrink-0",
            )}
          >
            <span className=" text-xs text-muted-fg tabular-nums">
              {hour.toString().padStart(2, "0")}:00
            </span>
            <div className={cn("h-[var(--timeline-height)] w-px bg-fg ")} />
            <div
              className={cn(
                "absolute right-0 top-[var(--timeline-margin-top)] h-[calc(var(--timeline-height)-var(--timeline-margin-top))] w-px bg-secondary ",
              )}
            />
          </div>
        ))}
        {sessionPositions.map((position, index) => {
          const { session, left, width } = position;
          const { columnIndex } = session;
          const colorClasses = getCustomColorClasses(session.hub.color);
          const isFocused = focusedSessionIndex === index;

          return (
            <RAButton
              key={session.id}
              className={cn(
                "absolute h-2 rounded-xs cursor-pointer transition-all duration-200 ",
                isFocused ? colorClasses.bg : "bg-secondary",
              )}
              style={{
                left: left,
                top: `calc(var(--timeline-margin-top) + ${columnIndex} * 12px)`,
                width: width,
              }}
              onPress={() => setFocusedSessionIndex(index)}
            />
          );
        })}
      </div>
      {/* Timeline container */}

      <div className="space-y-2 p-4 ">
        <div className="space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-[28px] w-32" />
            </>
          ) : (
            <>
              <p className=" text-lg tracking-wide font-medium">
                {timeToSession}
              </p>
              {/* (<p className="font-medium text-lg">
                {sessionPositions[focusedSessionIndex]?.session.hub.name}
              </p) */}
            </>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            onPress={focusPreviousSession}
            isDisabled={focusedSessionIndex === 0}
            intent="secondary"
            size="xs"
            className="w-full inset-ring-transparent"
            aria-label="Previous session"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} data-slot="icon" />
          </Button>
          <Button
            onPress={focusNextSession}
            isDisabled={focusedSessionIndex === sessionPositions.length - 1}
            intent="secondary"
            size="xs"
            className="w-full inset-ring-transparent"
            aria-label="Next session"
          >
            <HugeiconsIcon icon={ArrowRight02Icon} data-slot="icon" />
          </Button>
        </div>
      </div>
    </div>
  );
}
