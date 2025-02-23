import { Popover } from "@/components/ui/new/ui";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import dynamic from "next/dynamic";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { formatDate24Hour } from "../../../../../lib/temporal-formatting/index";
import type { OccurrenceGridPosition } from "../../calendar.types";
import { useMergedOccurrence } from "../../hooks/use-merged-occurrence";
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

const useDayViewOccurrence = () =>
  useCalendarStore(
    useShallow(({ editedOccurrenceId }) => ({
      editedOccurrenceId,
    })),
  );

export const DayViewOccurrence = ({
  occurrenceId,
  columnIndex,
  totalColumns,
}: OccurrenceGridPosition) => {
  const { editedOccurrenceId } = useDayViewOccurrence();
  const mergedOccurrence = useMergedOccurrence({ occurrenceId });

  if (!mergedOccurrence) return null;

  const heightPx = calculateOccurrenceHeight(
    mergedOccurrence.startTime,
    mergedOccurrence.endTime,
  );

  const topPx = calculateOccurrenceTop({
    hours: mergedOccurrence.startTime.hour,
    minutes: mergedOccurrence.startTime.minute,
  });

  const startTimeLabel = formatDate24Hour(mergedOccurrence.startTime);
  const endTimeLabel = formatDate24Hour(mergedOccurrence.endTime);
  const eventColor = getCalendarColor(mergedOccurrence.color);

  const widthPercentage = 100 / totalColumns;
  const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 4;
  const isEditing = editedOccurrenceId === occurrenceId;

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
              {mergedOccurrence.title ? mergedOccurrence.title : "Untitled"}
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

      <LazyPopoverContent occurrence={mergedOccurrence} />
    </Popover>
  );
};
