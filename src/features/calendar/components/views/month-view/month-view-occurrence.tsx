import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
import { cn } from "@/shared/lib/classes";
import { Popover, type PopoverContentProps } from "@/ui/popover";
import { format } from "date-fns";
import { Button } from "react-aria-components";
import { SessionPopover } from "../../session-popover-content";

export const MonthViewOccurrence = ({
  session,
  className,
  popoverProps,
  onEditPress,
}: {
  session: LayoutCalendarSession;
  className?: string;
  popoverProps?: Omit<PopoverContentProps, "children">;
  onEditPress?: () => void;
}) => {
  const color = getCalendarColor(session.hub?.color);
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
          {session.hub?.name || "Untitled"}
        </p>

        <p className={cn("text-current/70")}>
          {format(session.startTime, "HH:mm")}
        </p>
      </Button>

      <SessionPopover
        session={session}
        onEditPress={onEditPress}
        popoverProps={{
          placement: "top",
          ...popoverProps,
        }}
      />
    </Popover>
  );
};
