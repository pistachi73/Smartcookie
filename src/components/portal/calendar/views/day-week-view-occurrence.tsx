import { Popover } from "@/components/ui/new/ui";
import type { GroupedOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../components/event-occurrence-popover-content";
import {
  PIXELS_PER_15_MINUTES,
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
} from "../utils";

const useDayWeekViewOccurrence = () =>
  useCalendarStore(
    useShallow(({ editingEventOccurrenceId }) => ({
      editingEventOccurrenceId,
    })),
  );

export const DayWeekViewOccurrence = ({
  occurrence,
}: {
  occurrence: GroupedOccurrence;
}) => {
  const { editingEventOccurrenceId } = useDayWeekViewOccurrence();

  if (occurrence.isDraft) return null;

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

  const isEditing = editingEventOccurrenceId === occurrence.eventOccurrenceId;
  console.log({ isShortEvent, heightPx });
  return (
    <Popover>
      <Button
        className={cn("absolute pr-2 pb-0.5 z-10")}
        excludeFromTabOrder
        style={{
          top: `${topPx}px`,
          height: `${heightPx}px`,
          width: `${widthPercentage}%`,
          left: `${occurrence.columnIndex * widthPercentage}%`,
        }}
      >
        <div
          className={cn(
            "relative h-full w-full bg-[#286552] flex rounded-md gap-2 overflow-hidden",
            "border border-transparent",
            isShortEvent && "items-center",
            isEditing && "border-responsive-dark/70",
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
          <div className="w-full absolute top-0 cursor-ns-resize right-0 h-1 bg-transparent" />
          <div className="w-full absolute bottom-0 cursor-ns-resize right-0 h-1 bg-transparent" />
        </div>
      </Button>

      <EventOccurrencePopover occurrence={occurrence} />
    </Popover>
  );
};
