import { Popover, type PopoverProps } from "@/components/ui/react-aria/popover";
import type { GroupedCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { Button, DialogTrigger } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrenceDialog } from "../../components/event-occurrence-dialog";

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
  popoverProps?: Omit<PopoverProps, "children">;
  onEditPress?: () => void;
}) => {
  const { editingEventOccurrenceId } = useMonthViewOccurrence();
  const isEditing = editingEventOccurrenceId === occurrence.eventOccurrenceId;
  return (
    <DialogTrigger>
      <Button
        className={cn(
          "border border-transparent text-xs min-w-0 w-full h-6 p-0.5 px-1 rounded-md text-text-default hover:bg-base-highlight flex gap-1 items-center transition-colors cursor-pointer",
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

      <Popover placement="top" {...popoverProps}>
        <EventOccurrenceDialog
          occurrence={occurrence}
          onEditPress={onEditPress}
        />
      </Popover>
    </DialogTrigger>
  );
};
