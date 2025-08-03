import { format } from "date-fns";
import { Button } from "react-aria-components";

import { Popover, type PopoverContentProps } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { LayoutCalendarSession } from "@/features/calendar/types/calendar.types";
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
          "pointer-events-auto w-full text-xs p-0.5 sm:p-1 px-1 rounded-sm sm:rounded-md  flex gap-1 items-center transition-colors cursor-pointer overflow-hidden",
          "flex justify-between",
          "outline-0 outline-offset-2 hover:no-underline focus-visible:outline-2 outline-primary",
          className,
          color?.className,
          isEditing && "border-fg",
        )}
      >
        <p className="whitespace-nowrap sm:truncate font-medium leading-tight">
          {session.hub?.name || "Untitled"}
        </p>

        <p className={cn("hidden sm:block text-current/70")}>
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
