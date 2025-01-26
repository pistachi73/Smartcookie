import { Popover } from "@/components/ui/react-aria/popover";
import type { GroupedOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useState } from "react";
import { Button, DialogTrigger } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrenceDialog } from "../components/event-occurrence-dialog";
import { calculateOccurrenceHeight, calculateOccurrenceTop } from "../utils";

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

  const isShortEvent = heightPx / 15 <= 1;
  const startTimeLabel = format(occurrence.startTime, "HH:mm");
  const endTimeLabel = format(occurrence.endTime, "HH:mm");

  const isEditing = editingEventOccurrenceId === occurrence.eventOccurrenceId;
  return (
    <DialogTrigger>
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
            "relative h-full w-full bg-[#286552] flex rounded-md gap-2 overflow-hidden",
            "border border-transparent",
            isShortEvent && "items-center",
            isEditing && "border-responsive-dark/70",
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
          <div className="w-full absolute top-0 cursor-ns-resize right-0 h-1 bg-transparent" />
          <div className="w-full absolute bottom-0 cursor-ns-resize right-0 h-1 bg-transparent" />
        </div>
      </Button>

      <Popover placement="top">
        <EventOccurrenceDialog occurrence={occurrence} />
      </Popover>
    </DialogTrigger>
  );
};
