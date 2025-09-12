"use client";

import { useEffect, useRef } from "react";
import { Button } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Temporal } from "temporal-polyfill";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/classes";

import { useCurrentTime } from "@/features/calendar/hooks/use-current-time";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import { DayColumn } from "./day-column";
import { HourColumn } from "./hour-column";
import { HourRowsColumn } from "./hour-rows-column";

const dayButtonVariants = tv({
  base: "flex-1 w-full rounded-lg p-1 sm:p-2 cursor-pointer flex flex-col sm:flex-row items-center justify-center sm:gap-1 outline-0 outline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-primary",
  variants: {
    isToday: {
      true: "text-current bg-primary-tint font-medium",
    },
    isSelected: {
      true: "bg-accent text-accent-fg",
    },
    is1DayView: {
      false: "hover:bg-secondary transition-colors",
    },
  },
  compoundVariants: [
    {
      isToday: true,
      isSelected: false,
      is1DayView: false,
      class: "hover:bg-primary-tint hover:saturate-150",
    },
  ],
});

export const DayView = () => {
  const set1DayView = useCalendarStore((store) => store.set1DayView);
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const visibleDates = useCalendarStore((store) => store.visibleDates);
  const { down } = useViewport();
  const isMobile = down("sm");
  const { top: currentTimeTop } = useCurrentTime();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const is1DayView = visibleDates.length === 1;
  const hideDayHeader = is1DayView && isMobile;

  // biome-ignore lint/correctness/useExhaustiveDependencies: Just run on mount
  useEffect(() => {
    if (scrollContainerRef.current && currentTimeTop !== undefined) {
      const scrollPosition = Math.max(0, currentTimeTop - 200);
      scrollContainerRef.current.scrollTop = scrollPosition;
    }
  }, []);

  return (
    <div className="flex flex-col h-full relative overflow-hidden ">
      {!hideDayHeader && (
        <div className="w-full flex items-center border-b">
          <div className="w-10 sm:w-16 shrink-0 h-full flex items-center pl-3 border-r py-2">
            <p className="text-xs text-muted-fg">{isMobile ? "" : "Time"}</p>
          </div>
          <div className="flex items-center w-full p-1 gap-1 ">
            {visibleDates.map((date) => {
              const isToday = date.equals(Temporal.Now.plainDateISO());
              const isSelected = date.equals(selectedDate);
              return (
                <Button
                  key={date.toString()}
                  className={dayButtonVariants({
                    isToday,
                    isSelected: isSelected && !isToday,
                    is1DayView,
                  })}
                  onPress={() => set1DayView(date)}
                >
                  <p
                    className={cn(
                      "text-[10px] sm:text-xs   uppercase tabular-nums",
                    )}
                  >
                    {date.toLocaleString("en-US", {
                      weekday: isMobile ? "narrow" : "short",
                    })}
                  </p>
                  <p
                    className={cn("text-sm sm:text-xs  uppercase tabular-nums")}
                  >
                    {date.day.toString().padStart(2, "0")}
                  </p>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      <div
        ref={scrollContainerRef}
        className="relative flex flex-col overflow-y-scroll no-scrollbar"
      >
        <div className="items-stretch flex flex-auto ">
          <HourColumn />
          <div className="ml-1 flex flex-row w-full h-auto relative">
            <HourRowsColumn />
            {visibleDates.map((date) => (
              <DayColumn key={date.toString()} date={date} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
