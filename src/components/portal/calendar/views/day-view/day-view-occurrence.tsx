import { Popover } from "@/components/ui/new/ui";
import type { GroupedOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";
import {
  CALENDAR_EVENT_COLORS_MAP,
  DEFAULT_EVENT_COLOR,
  PIXELS_PER_15_MINUTES,
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
} from "../../utils";

const useDayViewOccurrence = () =>
  useCalendarStore(
    useShallow(({ editingEventOccurrenceId, getMergedOccurrence }) => ({
      editingEventOccurrenceId,
      getMergedOccurrence,
    })),
  );

export const DayViewOccurrence = ({
  occurrence: occurrence_,
}: {
  occurrence: GroupedOccurrence;
}) => {
  const { editingEventOccurrenceId, getMergedOccurrence } =
    useDayViewOccurrence();
  const occurrence = getMergedOccurrence(occurrence_.eventOccurrenceId);

  if (!occurrence) return null;
  console.log({ occurrence, id: occurrence.eventOccurrenceId });

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
  const eventColor =
    CALENDAR_EVENT_COLORS_MAP.get(occurrence.color) ??
    CALENDAR_EVENT_COLORS_MAP.get(DEFAULT_EVENT_COLOR);

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
          left: `${occurrence.columnIndex * widthPercentage}%`,
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
              {occurrence.title ? occurrence.title : "Untitled"}
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

      <EventOccurrencePopover occurrence={occurrence} />
    </Popover>
  );
};
