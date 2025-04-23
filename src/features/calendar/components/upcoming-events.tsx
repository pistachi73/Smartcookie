import { Temporal } from "temporal-polyfill";

import { getCalendarColor } from "@/features/calendar/lib/utils";
import type { CalendarSession } from "@/features/calendar/types/calendar.types";

import { cn } from "@/shared/lib/classes";
import { format } from "date-fns";

import { Heading } from "@/ui/heading";
import {
  ArrowRight02Icon,
  Clock02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCalendarDay } from "../hooks/use-calendar-sessions";

export const UpcomingEvents = () => {
  // Memoize the current date to prevent it from changing on each render
  const now = Temporal.Now.plainDateISO();

  const { sessions } = useCalendarDay(now);

  return (
    <div className="flex flex-col gap-3 relative items-stretch">
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col items-center bg-overlay rounded-sm border-fg/25 border overflow-hidden ">
          <p className="text-xs bg-overlay-highlight px-3 py-0.5 text-muted-fg">
            {format(now.toString(), "MMM")}
          </p>
          <p className="py-0.5  font-semibold">
            {format(now.toString(), "dd")}
          </p>
        </div>
        <div>
          <Heading level={4}>Upcoming Events</Heading>
          <p className="text-sm text-muted-fg">Don't miss scheduled events</p>
        </div>
      </div>

      <div className="space-y-2">
        {sessions.length > 0 ? (
          sessions
            .slice(0, 3)
            .map((session) => (
              <UpcomingOccurrenceCard
                key={`upcoming-session-${session.id}`}
                session={session}
              />
            ))
        ) : (
          <EmptyUpcomingEvents />
        )}
      </div>
    </div>
  );
};

const EmptyUpcomingEvents = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center bg-overlay-highlight rounded-xl">
      <p className="text-sm font-medium mb-1">No upcoming events</p>
      <p className="text-xs text-muted-fg">Your schedule is clear for now</p>
    </div>
  );
};

const UpcomingOccurrenceCard = ({ session }: { session: CalendarSession }) => {
  const color = getCalendarColor(session.hub?.color);

  return (
    <div
      className={cn(
        "border shadow-xs dark:bg-overlay-elevated",
        "relative h-full w-full flex items-stretch rounded-md gap-3 pl-1 pr-2",
        "hover:bg-secondary cursor-pointer",
      )}
    >
      <div
        className={cn(
          "my-1 rounded-lg w-1 shrink-0 min-w-0 min-h-0 border",
          color?.className,
        )}
      />
      <div
        className={cn("text-left flex flex-col gap-0 justify-between py-2.5")}
      >
        <div className="flex flex-row items-center gap-1.5">
          <HugeiconsIcon icon={Clock02Icon} size={12} />
          <div className="flex items-center gap-1 text-xs text-muted-fg">
            {format(session.startTime, "HH:mm")}
            <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            {format(session.endTime, "HH:mm")}
          </div>
        </div>
        <p className="text-sm line-clamp-2 font-normal leading-tight">
          {session.hub?.name ?? "Untitled"}
        </p>
      </div>
    </div>
  );
};
