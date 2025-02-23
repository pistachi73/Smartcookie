import { Popover, type PopoverContentProps } from "@/components/ui/new/ui";
import { get24HourTime } from "@/lib/temporal/format";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { Button } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrencePopover } from "../../components/event-occurrence-popover-content";
import { useMergedOccurrence } from "../../hooks/use-merged-occurrence";
import { getCalendarColor } from "../../utils";

const useMonthViewOccurrence = () =>
  useCalendarStore(
    useShallow((store) => ({
      editedOccurrenceId: store.editedOccurrenceId,
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
  const { editedOccurrenceId } = useMonthViewOccurrence();
  const mergedOccurrence = useMergedOccurrence({ occurrenceId });
  if (!mergedOccurrence) return null;

  const color = getCalendarColor(mergedOccurrence.color);
  const isEditing = editedOccurrenceId === mergedOccurrence.occurrenceId;

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
          {mergedOccurrence.title ? mergedOccurrence.title : "Untitled"}
        </p>

        <p className={cn("text-current/70")}>
          {get24HourTime(mergedOccurrence.startTime)}
        </p>
      </Button>

      <EventOccurrencePopover
        occurrence={mergedOccurrence}
        onEditPress={onEditPress}
        popoverProps={{
          placement: "top",
          ...popoverProps,
        }}
      />
    </Popover>
  );
};
