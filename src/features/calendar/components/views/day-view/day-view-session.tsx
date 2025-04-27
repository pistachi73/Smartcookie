import {
  PIXELS_PER_15_MINUTES,
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
  getCalendarColor,
} from "@/features/calendar/lib/utils";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import { cn } from "@/shared/lib/classes";
import { Popover } from "@/ui/popover";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { Button } from "react-aria-components";

const LazyPopoverContent = dynamic(() =>
  import("../../session-popover-content").then((mod) => mod.SessionPopover),
);

export const DayViewSession = ({
  session,
}: { session: LayoutCalendarSession }) => {
  if (!session) return null;

  const startTimeDate = new Date(session.startTime);
  const endTimeDate = new Date(session.endTime);

  const heightPx = calculateOccurrenceHeight(startTimeDate, endTimeDate);

  const topPx = calculateOccurrenceTop({
    hours: startTimeDate.getHours(),
    minutes: startTimeDate.getMinutes(),
  });

  const startTimeLabel = format(startTimeDate, "HH:mm");
  const endTimeLabel = format(endTimeDate, "HH:mm");
  const eventColor = getCalendarColor(session.hub?.color);

  const widthPercentage = 100 / session.totalColumns;
  const isShortEvent = heightPx / PIXELS_PER_15_MINUTES <= 2;
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
          left: `${session.columnIndex * widthPercentage}%`,
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
              {session.hub?.name ? session.hub.name : "Untitled"}
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

      <LazyPopoverContent session={session} />
    </Popover>
  );
};
