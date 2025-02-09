import type { GroupedDraftCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "react-aria-components";
import {
  PIXELS_PER_15_MINUTES,
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
} from "../../utils";

export const DayViewDraftOccurrence = ({
  occurrence,
}: {
  occurrence: GroupedDraftCalendarOccurrence;
}) => {
  const heightPx = calculateOccurrenceHeight(
    occurrence.startTime,
    occurrence.endTime,
  );

  const topPx = calculateOccurrenceTop({
    hours: occurrence.startTime.getHours(),
    minutes: occurrence.startTime.getMinutes(),
  });

  const widthPercentage = 100 / occurrence.totalColumns;
  const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 4;
  const startTimeLabel = format(occurrence.startTime, "HH:mm");
  const endTimeLabel = format(occurrence.endTime, "HH:mm");

  return (
    <Button
      className={cn("absolute pb-0.5 pr-1.5 z-10")}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        width: `${widthPercentage}%`,
        left: `${occurrence.columnIndex * widthPercentage}%`,
      }}
    >
      <div
        className={cn(
          "flex border px-1.5 h-full border-fg bg-overlay-elevated-highlight w-full overflow-hidden",
          isShortEvent
            ? "rounded-sm flex-row justify-between gap-1 items-center"
            : "rounded-md flex-col items-start py-1.5 gap-0.5",
        )}
      >
        <p className="truncate font-semibold leading-tight text-xs">
          {occurrence.title ? occurrence.title : "Untitled"}
        </p>

        <p
          className={cn("text-current/70 text-xs", !isShortEvent && "truncate")}
        >
          {isShortEvent
            ? startTimeLabel
            : `${startTimeLabel} - ${endTimeLabel}`}
        </p>
      </div>
    </Button>
  );
};
