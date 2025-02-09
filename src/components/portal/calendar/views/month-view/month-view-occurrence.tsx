import { Popover, type PopoverContentProps } from "@/components/ui/new/ui";
import type { GroupedCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";
import { CALENDAR_EVENT_COLORS_MAP, DEFAULT_EVENT_COLOR } from "../../utils";

const useMonthViewOccurrence = () =>
  useCalendarStore(
    useShallow((store) => ({
      editingEventOccurrenceId: store.editingEventOccurrenceId,
    })),
  );

export const MonthViewOccurrence = ({
  occurrence,
  className,
  popoverProps,
  onEditPress,
}: {
  occurrence: GroupedCalendarOccurrence;
  className?: string;
  popoverProps?: Omit<PopoverContentProps, "children">;
  onEditPress?: () => void;
}) => {
  const { editingEventOccurrenceId } = useMonthViewOccurrence();
  const color =
    CALENDAR_EVENT_COLORS_MAP.get(occurrence.color) ??
    CALENDAR_EVENT_COLORS_MAP.get(DEFAULT_EVENT_COLOR);

  const isEditing = editingEventOccurrenceId === occurrence.eventOccurrenceId;
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
          {occurrence.title ? occurrence.title : "Untitled"}
        </p>

        <p className={cn("text-current/70")}>
          {format(occurrence.startTime, "HH:mm")}
        </p>
      </Button>

      <EventOccurrencePopover
        occurrence={occurrence}
        onEditPress={onEditPress}
        popoverProps={{
          placement: "top",
          ...popoverProps,
        }}
      />
    </Popover>
  );
};
