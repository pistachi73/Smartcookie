"use client";

import { format } from "date-fns";
import { Button } from "react-aria-components";
import { Temporal } from "temporal-polyfill";

import { Heading } from "@/shared/components/ui/heading";
import { Popover } from "@/shared/components/ui/popover";
import { AgendaSessionCard } from "@/shared/components/sessions/agenda-session-card";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-card-skeleton";
import { cn } from "@/shared/lib/classes";

import { useOptimizedDaySessions } from "../hooks/use-optimized-calendar-sessions";
import { transformCalendarSessionToAgendaData } from "../lib/transform-calendar-data";
import { useCalendarStore } from "../providers/calendar-store-provider";
import { SessionPopover } from "./session-popover-content";

interface DayEventsProps {
  date: Temporal.PlainDate;
}

export const DaySessions = ({ date }: DayEventsProps) => {
  const { sessions } = useOptimizedDaySessions(date);

  const today = Temporal.Now.plainDateISO();
  const tomorrow = today.add({ days: 1 });

  const isToday = date.equals(today);
  const isTomorrow = date.equals(tomorrow);

  const getDateLabel = () => {
    const formattedDate = format(new Date(date.toString()), "EEEE, MMMM do");
    if (isToday) return `Today · ${formattedDate}`;
    if (isTomorrow) return `Tomorrow · ${formattedDate}`;
    return formattedDate;
  };

  return (
    <div className="space-y-2 w-full min-w-0">
      <p className="text-sm font-medium  truncate bg-muted p-2 py-1 rounded-sm">
        {getDateLabel()}
      </p>
      <div className="space-y-2 w-full min-w-0">
        {sessions?.length > 0 ? (
          sessions.map((session) => (
            <Popover key={`upcoming-session-${session.id}`}>
              <Button
                className={(props) =>
                  cn(
                    "block text-left p-0.5 w-full rounded-md transition-colors",
                    props.isHovered && "bg-muted/50",
                    props.isPressed && "bg-primary-tint",
                  )
                }
              >
                <AgendaSessionCard
                  session={transformCalendarSessionToAgendaData(session)}
                  showStudentTooltips={false}
                />
              </Button>
              <SessionPopover
                session={session}
                popoverProps={{
                  placement: "right",
                }}
              />
            </Popover>
          ))
        ) : (
          <p className="text-sm px-2">No sessions scheduled</p>
        )}
      </div>
    </div>
  );
};

export const UpcomingSessions = () => {
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const { isLoading } = useOptimizedDaySessions(selectedDate);

  const next7Days = Array.from({ length: 7 }, (_, i) =>
    selectedDate.add({ days: i }),
  );

  return (
    <div className="flex flex-col gap-4 relative items-stretch w-full min-w-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <Heading level={4} className="font-semibold truncate">
          Upcoming Sessions
        </Heading>
      </div>

      <div className="space-y-4 w-full min-w-0">
        {isLoading ? (
          <div className="space-y-2 w-full min-w-0">
            {Array.from({ length: 3 }, (_, i) => (
              <AgendaSessionCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          next7Days.map((date) => (
            <DaySessions key={date.toString()} date={date} />
          ))
        )}
      </div>
    </div>
  );
};
