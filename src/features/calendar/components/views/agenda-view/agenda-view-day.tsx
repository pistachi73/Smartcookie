import type { Temporal } from "temporal-polyfill";

import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";
import { getMonthAbbrev, getWeekday } from "@/shared/lib/temporal/format";

import { useCalendarDay } from "@/features/calendar/hooks/use-calendar-sessions";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import { AgendaViewNoEvents } from "./agenda-view-no-events";
import { AgendaViewOccurrence } from "./agenda-view-occurrence";

export const AgendaViewDay = ({ date }: { date: Temporal.PlainDate }) => {
  const selectedDate = useCalendarStore((store) => store.selectedDate);
  const isToday = selectedDate.dayOfYear === date.dayOfYear;

  const { sessions } = useCalendarDay(date);

  return (
    <div key={date.toString()} className="h-full flex gap-2">
      <div
        className={cn(
          "rounded-lg w-30 bg-bg dark:bg-overlay-highlight p-3 px-4",
          isToday && "bg-primary-tint",
        )}
      >
        <Heading level={3} className="text-base font-medium text-current ">
          {getMonthAbbrev(date)} {date.day}
        </Heading>
        <p className="text-sm text-muted-fg">{getWeekday(date)}</p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        {sessions && sessions.length > 0 ? (
          sessions.map((session) => (
            <AgendaViewOccurrence
              key={`agenda-view-session-${session.id}`}
              session={session}
            />
          ))
        ) : (
          <AgendaViewNoEvents />
        )}
      </div>
    </div>
  );
};
