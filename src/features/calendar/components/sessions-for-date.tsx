"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";

import { Heading } from "@/shared/components/ui/heading";
import { AgendaSessionCard } from "@/shared/components/sessions/agenda-session-card";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-skeleton";

import { useOptimizedDaySessions } from "../hooks/use-optimized-calendar-sessions";
import { transformCalendarSessionToAgendaData } from "../lib/transform-calendar-data";
import { useCalendarStore } from "../providers/calendar-store-provider";

export const SessionsForDate = () => {
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const { sessions, isLoading } = useOptimizedDaySessions(selectedDate);

  return (
    <div className="flex flex-col gap-3 relative items-stretch w-full min-w-0">
      <div className="flex flex-row items-center gap-2 min-w-0">
        <HugeiconsIcon
          icon={Calendar03Icon}
          size={18}
          className="text-muted-fg shrink-0"
        />
        <Heading level={4} className="font-semibold truncate">
          {format(selectedDate.toString(), "EEEE, MMMM dd, yyyy")}
        </Heading>
      </div>
      <div className="space-y-2.5 w-full min-w-0">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <AgendaSessionCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : sessions && sessions?.length > 0 ? (
          sessions?.map((session) => (
            <AgendaSessionCard
              key={`date-session-${session.id}`}
              session={transformCalendarSessionToAgendaData(session)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center bg-accent rounded-lg">
            <p className="text-sm font-medium mb-1">No events scheduled</p>
            <p className="text-xs text-muted-fg">Nothing for this day</p>
          </div>
        )}
      </div>
    </div>
  );
};
