import { format } from "date-fns";

import { cn } from "@/shared/lib/classes";

import {
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
  getCalendarColor,
  PIXELS_PER_15_MINUTES,
} from "@/features/calendar/lib/utils";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";

interface PreviewSessionProps {
  session: LayoutCalendarSession;
  isVisible: boolean;
}

export const PreviewSession = ({ session, isVisible }: PreviewSessionProps) => {
  if (!isVisible || !session) return null;

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

  return (
    <div
      className={cn(
        "absolute pb-0.5 pr-1 z-20 transition-all duration-200 ease-out",
        "pointer-events-none",
      )}
      style={{
        top: `${topPx}px`,
        height: `${heightPx}px`,
        width: `${widthPercentage}%`,
        left: `${session.columnIndex * widthPercentage}%`,
      }}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden",
          eventColor?.className,
          isShortEvent ? "rounded-sm" : "rounded-md",
          "border-2 border-dashed border-primary/60",
          "bg-primary/10 backdrop-blur-sm",
          "animate-pulse",
        )}
      >
        <div
          className={cn(
            "text-left px-1.5 flex w-full",
            isShortEvent
              ? "flex-row justify-between gap-1 h-full items-center"
              : "flex-col py-1.5 gap-0.5",
          )}
        >
          <p className="font-semibold leading-tight text-xs whitespace-nowrap text-primary">
            {session.hub?.name ? session.hub.name : "Untitled"}
          </p>

          <p className="text-primary/70 text-xs whitespace-nowrap">
            {isShortEvent
              ? startTimeLabel
              : `${startTimeLabel} - ${endTimeLabel}`}
          </p>
        </div>

        {/* Preview indicator */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
      </div>
    </div>
  );
};
