import { format } from "date-fns";
import { Temporal } from "temporal-polyfill";

import { Heading } from "@/ui/heading";
import { AgendaSessionCard } from "@/shared/components/sessions/agenda-session-card";

import { useCalendarDay } from "../hooks/use-calendar-sessions";
import { transformCalendarSessionToAgendaData } from "../lib/transform-calendar-data";

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
              <AgendaSessionCard
                key={`upcoming-session-${session.id}`}
                session={transformCalendarSessionToAgendaData(session)}
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
