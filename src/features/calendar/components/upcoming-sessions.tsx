"use client";

import { format } from "date-fns";
import { Temporal } from "temporal-polyfill";

import { Heading } from "@/shared/components/ui/heading";
import { AgendaSessionCard } from "@/shared/components/sessions/agenda-session-card";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-skeleton";

import { useOptimizedDaySessions } from "../hooks/use-optimized-calendar-sessions";
import { transformCalendarSessionToAgendaData } from "../lib/transform-calendar-data";
import type { CalendarSession } from "../types/calendar.types";

interface DayEventsProps {
  date: Temporal.PlainDate;
  nowDateTime: Temporal.PlainDateTime;
}

const DaySessions = ({ date, nowDateTime }: DayEventsProps) => {
  const { sessions, isLoading } = useOptimizedDaySessions(date);

  // Filter out sessions that have already ended
  const upcomingSessions = sessions?.filter((session) => {
    return new Date(session.endTime) > new Date(nowDateTime.toString());
  });

  if (isLoading) {
    return (
      <div className="space-y-2 w-full min-w-0">
        <p className="text-sm font-medium text-muted-fg truncate">
          {format(new Date(date.toString()), "EEEE, MMMM dd")}
        </p>
        <div className="space-y-2 w-full min-w-0">
          <AgendaSessionCardSkeleton />
        </div>
      </div>
    );
  }

  if (upcomingSessions?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 w-full min-w-0">
      <p className="text-sm font-medium text-muted-fg truncate">
        {format(new Date(date.toString()), "EEEE, MMMM dd")}
      </p>
      <div className="space-y-2 w-full min-w-0">
        {upcomingSessions?.map((session: CalendarSession) => (
          <AgendaSessionCard
            key={`upcoming-session-${session.id}`}
            session={transformCalendarSessionToAgendaData(session)}
          />
        ))}
      </div>
    </div>
  );
};

export const UpcomingSessions = () => {
  const nowDateTime = Temporal.Now.plainDateTimeISO();
  const nowDate = Temporal.Now.plainDateISO();

  // Get the next 7 days starting from today (including today)
  const next7Days = Array.from({ length: 7 }, (_, i) =>
    nowDate.add({ days: i }),
  );

  // Check if any day has upcoming sessions
  const hasUpcomingSessions = true; // We'll let each DayEvents component handle its own loading state

  return (
    <div className="flex flex-col gap-4 relative items-stretch w-full min-w-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <Heading level={4} className="font-semibold truncate">
          Upcoming Events
        </Heading>
        <p className="text-xs text-muted-fg truncate">
          Showing events for the next 7 days
        </p>
      </div>

      <div className="space-y-2.5 w-full min-w-0">
        {hasUpcomingSessions ? (
          next7Days.map((date) => (
            <DaySessions
              key={date.toString()}
              date={date}
              nowDateTime={nowDateTime}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center bg-accent rounded-lg">
            <p className="text-sm font-medium mb-1">No upcoming events</p>
            <p className="text-xs text-muted-fg">
              Your schedule is clear for the next 7 days
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
