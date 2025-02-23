import { Popover } from "@/components/ui/new/ui";
import { get24HourTime } from "@/lib/temporal/format";
import { cn } from "@/lib/utils";
import { Button } from "react-aria-components";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";
import { useMergedOccurrence } from "../../hooks/use-merged-occurrence";
import { getCalendarColor } from "../../utils";

export const AgendaViewOccurrence = ({
  occurrenceId,
}: { occurrenceId: number }) => {
  const mergedOccurrence = useMergedOccurrence({
    occurrenceId,
  });

  if (!mergedOccurrence) return null;
  const color = getCalendarColor(mergedOccurrence.color);
  return (
    <Popover>
      <Button
        key={`event-occurrence-${mergedOccurrence.occurrenceId}`}
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
            {mergedOccurrence.title}
          </p>
          <span className="text-xs line-clamp-1 text-text-sub">
            {get24HourTime(mergedOccurrence.startTime)} -{" "}
            {get24HourTime(mergedOccurrence.endTime)}
          </span>
        </div>
      </Button>
      <EventOccurrencePopover
        occurrence={mergedOccurrence}
        popoverProps={{
          placement: "end",
          offset: -200,
        }}
      />
    </Popover>
  );
};
