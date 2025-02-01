import { Popover, type PopoverContentProps } from "@/components/ui/new/ui";
import type { GroupedCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";

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
  const isEditing = editingEventOccurrenceId === occurrence.eventOccurrenceId;
  return (
    <Popover>
      <Button
        className={cn(
          "border border-transparent text-xs min-w-0 w-full h-6 p-0.5 px-1 rounded-md text-text-default hover:bg-overlay-elevated-highlight flex gap-1 items-center transition-colors cursor-pointer",
          className,
          isEditing && "border-responsivedark/70 bg-responsive-dark/10",
        )}
      >
        <div className="size-1 bg-lime-300 rounded-full shrink-0" />
        <p className="text-left text-text-default line-clamp-1">
          <span className="text-text-sub">
            {format(occurrence.startTime, "HH:mm")}
          </span>{" "}
          - {occurrence.title}
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
