import { format } from "date-fns";
import { Button } from "react-aria-components";

import { Popover } from "@/ui/popover";
import { cn } from "@/shared/lib/classes";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { CalendarSession } from "@/features/calendar/types/calendar.types";
import { SessionPopover } from "../../session-popover-content";

export const AgendaViewOccurrenceMobile = ({
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
          "p-2 relative h-auto w-full brightness-100 flex items-center rounded-md gap-3 transition-colors",
          "hover:bg-bg dark:hover:bg-overlay-highlight cursor-pointer",
          color?.className,
        )}
      >
        <div className={cn("text-left flex flex-col gap-0.5 justify-between")}>
          <p className="font-medium text-sm line-clamp-2 leading-tight mb-0.5">
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
          "p-3 relative h-full w-full brightness-100 grid grid-cols-[150px_1fr] gap-6 items-center rounded-md transition-colors",
          "hover:bg-bg dark:hover:bg-overlay-highlight cursor-pointer",
        )}
      >
        <div className="flex items-center gap-2">
          <span
            className={cn("w-2 h-2 rounded-full shrink-0", color?.className)}
            aria-hidden="true"
          />
          <span className="text-sm text-text-sub whitespace-nowrap">
            {format(session.startTime, "HH:mm")} -{" "}
            {format(session.endTime, "HH:mm")}
          </span>
        </div>

        <div className="text-left min-w-0">
          <p className="font-medium text-sm line-clamp-2 leading-tight">
            {session.hub?.name || "Untitled"}
          </p>
        </div>
      </Button>
      <SessionPopover
        session={session}
        popoverProps={{
          placement: "top left",
          showArrow: false,
          offset: 2,
          crossOffset: 12,
        }}
      />
    </Popover>
  );
};
