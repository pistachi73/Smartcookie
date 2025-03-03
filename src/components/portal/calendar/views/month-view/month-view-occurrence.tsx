import { Popover, type PopoverContentProps } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useEffect } from "react";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";
import { getCalendarColor } from "../../utils";

const useMonthViewOccurrence = (occurrenceId: number) =>
  useCalendarStore(
    useShallow((store) => ({
      uiOccurrence: store.getUIOccurrence(occurrenceId),
      cacheUIOccurrence: store.cacheUIOccurrence,
    })),
  );

export const MonthViewOccurrence = ({
  occurrenceId,
  className,
  popoverProps,
  onEditPress,
}: {
  occurrenceId: number;
  className?: string;
  popoverProps?: Omit<PopoverContentProps, "children">;
  onEditPress?: () => void;
}) => {
  const { uiOccurrence, cacheUIOccurrence } =
    useMonthViewOccurrence(occurrenceId);

  // If we have a UI occurrence, cache it for future use
  // Use useEffect to cache the UI occurrence to avoid state updates during render
  useEffect(() => {
    if (uiOccurrence) {
      cacheUIOccurrence(occurrenceId, uiOccurrence);
    }
  }, [occurrenceId, uiOccurrence, cacheUIOccurrence]);

  if (!uiOccurrence) return null;

  const color = getCalendarColor(uiOccurrence.color);
  const isEditing = false; // We can implement this later if needed

  return (
    <Popover>
      <Button
        className={cn(
          "w-full border border-transparent text-xs h-6 p-0.5 px-1 rounded-md  flex gap-1 items-center transition-colors cursor-pointer",
          "flex justify-between",
          className,
          color?.className,
          isEditing && "border-fg",
        )}
      >
        <p className="truncate font-semibold leading-tight">
          {uiOccurrence.title ? uiOccurrence.title : "Untitled"}
        </p>

        <p className={cn("text-current/70")}>
          {format(uiOccurrence.startTime, "HH:mm")}
        </p>
      </Button>

      <EventOccurrencePopover
        occurrence={uiOccurrence}
        onEditPress={onEditPress}
        popoverProps={{
          placement: "top",
          ...popoverProps,
        }}
      />
    </Popover>
  );
};
