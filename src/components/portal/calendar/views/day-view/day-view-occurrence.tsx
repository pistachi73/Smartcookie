import { Popover } from "@/components/ui/new/ui";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { memo, useMemo } from "react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import type { LayoutOccurrence } from "../../calendar.types";
import {
  PIXELS_PER_15_MINUTES,
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
  getCalendarColor,
} from "../../utils";

const LazyPopoverContent = dynamic(() =>
  import("../../components/event-occurrence-popover-content").then(
    (mod) => mod.EventOccurrencePopover,
  ),
);

export const DayViewOccurrence = memo(
  ({ occurrenceId, columnIndex, totalColumns }: LayoutOccurrence) => {
    const uiOccurrence = useCalendarStore(
      useShallow((state) => state.getUIOccurrence(occurrenceId)),
    );

    if (!uiOccurrence) return null;

    const [startTime, endTime] = useMemo(() => {
      return [new Date(uiOccurrence.startTime), new Date(uiOccurrence.endTime)];
    }, [uiOccurrence.startTime, uiOccurrence.endTime]);
>
    const heightPx = calculateOccurrenceHeight(startTime, endTime);

    const topPx = calculateOccurrenceTop({
      hours: startTime.getHours(),
      minutes: startTime.getMinutes(),
    });

    const startTimeLabel = format(startTime, "HH:mm");
    const endTimeLabel = format(endTime, "HH:mm");
    const eventColor = getCalendarColor(uiOccurrence.color);

    const widthPercentage = 100 / totalColumns;
    const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 4;
    const isEditing = false;

    return (
      <Popover>
        <Button
          className={cn(
            "absolute pb-0.5 pr-1.5 z-10 transition-transform duration-300 ease-in-out",
          )}
          excludeFromTabOrder
          style={{
            top: `${topPx}px`,
            height: `${heightPx}px`,
            width: `${widthPercentage}%`,
            left: `${columnIndex * widthPercentage}%`,
          }}
        >
          <div
            className={cn(
              "border relative h-full w-full overflow-hidden",
              eventColor?.className,
              isShortEvent ? "rounded-sm" : "rounded-md",
              isEditing && "border-fg",
            )}
          >
            <div
              className={cn(
                "text-left px-1.5 flex w-full",
                isShortEvent
                  ? "flex-row justify-between gap-1 h-full items-center"
                  : "flex-col py-1.5  gap-0.5",
              )}
            >
              <p className="truncate font-semibold leading-tight text-xs">
                {uiOccurrence.title ? uiOccurrence.title : "Untitled"}
              </p>

              <p
                className={cn(
                  "text-current/70 text-xs ",
                  !isShortEvent && "truncate",
                )}
              >
                {isShortEvent
                  ? startTimeLabel
                  : `${startTimeLabel} - ${endTimeLabel}`}
              </p>
            </div>
            <div className="w-full absolute top-0 cursor-ns-resize right-0 h-1 bg-transparent" />
            <div className="w-full absolute bottom-0 cursor-ns-resize right-0 h-1 bg-transparent" />
          </div>
        </Button>

        <LazyPopoverContent occurrence={uiOccurrence} />
      </Popover>
    );
  },
);
