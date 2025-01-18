import { type ZonedDateTime, parseAbsolute } from "@internationalized/date";

import type { GroupedDraftCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { Button } from "react-aria-components";
import { calculateOccurrenceHeight, calculateOccurrenceTop } from "../utils";

export const formatZonedDateTime = (zonedDateTime: ZonedDateTime) =>
  `${String(zonedDateTime.hour).padStart(2, "0")}:${String(zonedDateTime.minute).padStart(2, "0")}`;

export const DayWeekViewDraftOccurrence = ({
  occurrence,
}: {
  occurrence: GroupedDraftCalendarOccurrence;
}) => {
  const [parsedStartTime, parsedEndTime] = [
    parseAbsolute(occurrence.startTime.toISOString(), occurrence.timezone),
    parseAbsolute(occurrence.endTime.toISOString(), occurrence.timezone),
  ];

  const widthPercentage = 100 / occurrence.totalColumns;
  const topPercentage = calculateOccurrenceTop(occurrence.startTime);
  const heightPercentage = calculateOccurrenceHeight(
    occurrence.startTime,
    occurrence.endTime,
  );
  const top = parsedStartTime.hour + parsedStartTime.minute / 60;
  const bottom = parsedEndTime.hour + parsedEndTime.minute / 60;
  const height = bottom - top;

  const isShortEvent = height <= 1;

  const startTimeLabel = formatZonedDateTime(parsedStartTime);
  const endTimeLabel = formatZonedDateTime(parsedEndTime);

  return (
    <Button
      className={cn("absolute pr-2 pb-0.5 z-10")}
      style={{
        top: `${topPercentage}px`,
        height: `${heightPercentage}px`,
        width: `${widthPercentage}%`,
        left: `${occurrence.columnIndex * widthPercentage}%`,
      }}
    >
      <div
        className={cn(
          "h-full w-full  border-responsive-dark/80 bg-elevated-highlight flex rounded-md gap-2 overflow-hidden",
          "border ",
          isShortEvent && "items-center",
        )}
      >
        <div className="h-full w-1 bg-responsive-dark/70 shrink-0" />
        <div className={cn("text-left", !isShortEvent && "py-1.5 pr-2")}>
          <p className="line-clamp-2 font-normal leading-tight mb-0.5 text-xs">
            {occurrence.title ? occurrence.title : "Untitled event"}
            {isShortEvent && (
              <span className="text-text-sub ml-2">{startTimeLabel}</span>
            )}
          </p>
          {!isShortEvent && (
            <span className="line-clamp-1 text-text-sub text-xs">
              {startTimeLabel} - {endTimeLabel}
            </span>
          )}
        </div>
      </div>
    </Button>
  );
};
