import { Popover } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useEffect } from "react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";
import { getCalendarColor } from "../../utils";

export const AgendaViewOccurrence = ({
  occurrenceId,
}: { occurrenceId: number }) => {
  const { uiOccurrence, cacheUIOccurrence } = useCalendarStore(
    useShallow((store) => ({
      uiOccurrence: store.getUIOccurrence(occurrenceId),
      cacheUIOccurrence: store.cacheUIOccurrence,
    })),
  );

  // If we have a UI occurrence, cache it for future use
  useEffect(() => {
    if (uiOccurrence) {
      cacheUIOccurrence(occurrenceId, uiOccurrence);
    }
  }, [occurrenceId, uiOccurrence, cacheUIOccurrence]);

  if (!uiOccurrence) return null;

  const color = getCalendarColor(uiOccurrence.color);

  return (
    <Popover>
      <Button
        key={`event-occurrence-${uiOccurrence.occurrenceId}`}
        className={cn(
          "relative h-full w-full border brightness-100 flex items-center rounded-md gap-3 px-1 transition-colors",
          "hover:bg-overlay-highlight cursor-pointer",
        )}
      >
        <div
          className={cn(
            "h-[calc(100%-8px)] rounded-lg w-1.5 shrink-0 min-w-0 min-h-0 border",
            color?.className,
          )}
        />
        <div
          className={cn(
            "text-left flex flex-col gap-0.5 justify-between py-3 pr-2",
          )}
        >
          <p className="text-sm line-clamp-2 font-normal leading-tight mb-0.5">
            {uiOccurrence.title || "Untitled"}
          </p>
          <span className="text-xs line-clamp-1 text-text-sub">
            {format(uiOccurrence.startTime, "HH:mm")} -{" "}
            {format(uiOccurrence.endTime, "HH:mm")}
          </span>
        </div>
      </Button>
      <EventOccurrencePopover
        occurrence={uiOccurrence}
        popoverProps={{
          placement: "end",
          offset: -200,
        }}
      />
    </Popover>
  );
};
