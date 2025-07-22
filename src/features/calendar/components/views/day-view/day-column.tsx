import type { Temporal } from "temporal-polyfill";

import { cn } from "@/shared/lib/classes";

import { useCalendarDay } from "@/features/calendar/hooks/use-calendar-sessions";
import { DayViewSession } from "./day-view-session";
import { DragToCreateEvent } from "./drag-to-create-event";
import { HourMarker } from "./hour-marker";

export const DayColumn = ({ date }: { date: Temporal.PlainDate }) => {
  const { sessions } = useCalendarDay(date);

  console.log("day sessions", sessions);

  return (
    <div className={cn("h-full w-full relative")}>
      <DragToCreateEvent date={date} />
      <HourMarker date={date} />

      {sessions?.map((session) => (
        <DayViewSession
          key={`calendar-session-${session.id}`}
          session={session}
        />
      ))}
    </div>
  );
};
