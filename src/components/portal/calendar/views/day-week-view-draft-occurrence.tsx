import type { GroupedDraftCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "react-aria-components";
import {
  PIXELS_PER_15_MINUTES,
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
} from "../utils";

export const DayWeekViewDraftOccurrence = ({
  occurrence,
}: {
  occurrence: GroupedDraftCalendarOccurrence;
}) => {
  const [heightPx, setHeightPx] = useState(
    calculateOccurrenceHeight(occurrence.startTime, occurrence.endTime),
  );

  const widthPercentage = 100 / occurrence.totalColumns;

  const topPx = calculateOccurrenceTop({
    hours: occurrence.startTime.getHours(),
    minutes: occurrence.startTime.getMinutes(),
  });

  const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 4;
  const startTimeLabel = format(occurrence.startTime, "HH:mm");
  const endTimeLabel = format(occurrence.endTime, "HH:mm");

  return (
    <Button
      className={cn("absolute pr-2 pb-0.5 z-10")}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        width: `${widthPercentage}%`,
        left: `${occurrence.columnIndex * widthPercentage}%`,
      }}
    >
      <div
        className={cn(
          "h-full w-full  border-responsive-dark/80 bg-overlay-elevated-highlight flex rounded-md gap-2 overflow-hidden",
          "border ",
          isShortEvent && "items-center",
        )}
      >
        <div className="h-full w-1 bg-fg/70 shrink-0" />
        <div className={cn("text-left", !isShortEvent && "py-1.5 pr-2")}>
          <p className="truncate font-medium leading-tight mb-0.5 text-xs">
            {occurrence.title ? occurrence.title : "Untitled event"}
            {isShortEvent && (
              <span className="text-current/70 ml-2">{startTimeLabel}</span>
            )}
          </p>
          {!isShortEvent && (
            <p className="truncate text-current/70 text-xs">
              {startTimeLabel} - {endTimeLabel}
            </p>
          )}
        </div>
      </div>
    </Button>
  );
};
