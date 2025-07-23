import { format } from "date-fns";
import { Button } from "react-aria-components";

import { Popover } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { CalendarSession } from "@/features/calendar/types/calendar.types";
import { SessionPopover } from "../../session-popover-content";

export const AgendaViewOccurrence = ({
  session,
}: {
  session: CalendarSession;
}) => {
  const color = getCalendarColor(session.hub?.color);

  return (
    <Popover>
      <Button
        key={`calendar-session-${session.id}`}
        className={cn(
          "relative h-full w-full border brightness-100 flex items-center rounded-md gap-3 px-1 transition-colors",
          "hover:bg-bg dark:hover:bg-overlay-highlight cursor-pointer",
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
            {session.hub?.name || "Untitled"}
          </p>
          <span className="text-xs line-clamp-1 text-text-sub">
            {format(session.startTime, "HH:mm")} -{" "}
            {format(session.endTime, "HH:mm")}
          </span>
        </div>
      </Button>
      <SessionPopover
        session={session}
        popoverProps={{
          placement: "end",
          offset: -200,
        }}
      />
    </Popover>
  );
};
