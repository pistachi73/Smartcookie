import { Button } from "react-aria-components";
import { Temporal } from "temporal-polyfill";

import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/classes";
import {
  formatWeekRange,
  getMonthAbbrev,
  getWeekday,
  getWeekdayAbbrev,
} from "@/shared/lib/temporal/format";

import { useOptimizedDaySessions } from "@/features/calendar/hooks/use-optimized-calendar-sessions";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import {
  AgendaViewOccurrence,
  AgendaViewOccurrenceMobile,
} from "./agenda-view-occurrence";

const DayHeader = ({ date }: { date: Temporal.PlainDate }) => {
  const set1DayView = useCalendarStore((state) => state.set1DayView);
  const isToday = date.equals(Temporal.Now.plainDateISO());
  const { down } = useViewport();
  const isMobile = down("sm");

  return isMobile ? (
    <Button
      className={cn(
        "flex flex-col items-center w-16 h-auto p-2 rounded-md",
        isToday && "bg-primary-tint",
      )}
      onPress={() => {
        set1DayView(date);
      }}
    >
      <p className="text-xs font-medium text-current first-letter:uppercase">
        {getWeekdayAbbrev(date).toLowerCase()}
      </p>
      <p className="text-base tabular-nums font-medium">{date.day}</p>
    </Button>
  ) : (
    <Button
      className="flex items-center gap-2 w-46 hover:bg-secondary transition-colors p-1 h-auto mt-1.5 rounded-md cursor-pointer"
      onPress={() => set1DayView(date)}
    >
      <p className="text-base font-medium tabular-nums">{date.day}</p>
      <p className="text-base font-medium text-current">
        {getMonthAbbrev(date)}
      </p>
      <p className="text-sm text-muted-fg">{getWeekday(date)}</p>
    </Button>
  );
};

export const AgendaViewDay = ({ date }: { date: Temporal.PlainDate }) => {
  const { down } = useViewport();
  const isMobile = down("sm");

  const { sessions } = useOptimizedDaySessions(date);

  const isWeekStart = date.dayOfWeek === 1;
  const startOfWeek = date.subtract({ days: date.dayOfWeek - 1 });
  const endOfWeek = startOfWeek.add({ days: 6 });

  return (
    <div>
      {isWeekStart && isMobile && (
        <div className="grid grid-cols-[64px_auto] mb-2">
          <div />
          <p className="text-xs">
            {formatWeekRange(
              startOfWeek as Temporal.PlainDate,
              endOfWeek as Temporal.PlainDate,
            )}{" "}
            {startOfWeek.year}
          </p>
        </div>
      )}
      <div
        key={date.toString()}
        className={cn(
          "h-full flex gap-2 items-start",
          !isMobile && "border-b border-border py-2",
        )}
      >
        <DayHeader date={date} />

        <div className="flex flex-col gap-2 sm:gap-0.5 w-full">
          {sessions.length > 0 ? (
            sessions.map((session) =>
              isMobile ? (
                <AgendaViewOccurrenceMobile
                  key={`agenda-view-session-${session.id}`}
                  session={session}
                />
              ) : (
                <AgendaViewOccurrence
                  key={`agenda-view-session-${session.id}`}
                  session={session}
                />
              ),
            )
          ) : (
            <div className="flex gap-2 sm:gap-0.5 w-full items-center h-14 sm:h-11 px-2 sm:px-3">
              <p className="text-sm text-muted-fg italic">No sessions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
