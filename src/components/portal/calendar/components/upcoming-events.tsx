import { Heading } from "@/components/ui/new/ui";
import type { GroupedOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { ArrowRight02Icon, Clock02Icon } from "@hugeicons/react";
import { format } from "date-fns";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { getCalendarColor, getEventOccurrenceDayKey } from "../utils";

const useUpcomingEvents = () =>
  useCalendarStore(
    useShallow((store) => ({
      groupedEventOccurrences: store.groupedEventOccurrences,
    })),
  );

export const UpcomingEvents = () => {
  const { groupedEventOccurrences } = useUpcomingEvents();
  const today = new Date();
  const todayKey = useMemo(() => getEventOccurrenceDayKey(new Date()), []);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const upcomingEvents = groupedEventOccurrences[todayKey];
    if (!upcomingEvents) return [];

    upcomingEvents.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.getHours() >= now.getHours();
    });

    return upcomingEvents;
  }, [groupedEventOccurrences, todayKey]);

  return (
    <div className="flex flex-col gap-3 relative items-stretch">
      <div className="flex flex-row items-center gap-3 p-2">
        <div className="flex flex-col items-center bg-overlay rounded-sm border-fg/25 border overflow-hidden ">
          <p className="text-xs bg-overlay-highlight px-3 py-0.5 text-muted-fg">
            {format(today, "MMM")}
          </p>
          <p className="py-0.5  font-semibold">
            {String(today.getDate()).padStart(2, "0")}
          </p>
        </div>
        <div>
          <Heading level={4}>Upcoming Events</Heading>
          <p className="text-sm text-muted-fg">Don’t miss scheduled events</p>
        </div>
      </div>

      <div className="space-y-2">
        {upcomingEvents.slice(0, 3).map((event) => (
          <UpcomingEventCard
            key={`upcoming-event-${event.eventOccurrenceId}`}
            event={event}
          />
        ))}
      </div>
    </div>
  );
};

const UpcomingEventCard = ({ event }: { event: GroupedOccurrence }) => {
  const color = getCalendarColor(event.color);

  return (
    <div
      key={`upcoming-event-${event.eventOccurrenceId}`}
      className={cn(
        "bg-overlay-elevated",
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
          <Clock02Icon size={12} variant="stroke" />
          <div className="flex items-center gap-1 text-xs text-muted-fg">
            {format(event.startTime, "HH:mm")}
            <ArrowRight02Icon size={14} />
            {format(event.endTime, "HH:mm")}
          </div>
        </div>
        <p className="text-sm line-clamp-2 font-normal leading-tight">
          {event.title ?? "Untitled"}
        </p>
      </div>
    </div>
  );
};
