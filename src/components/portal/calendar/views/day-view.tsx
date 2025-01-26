import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useShallow } from "zustand/react/shallow";

import { CalendarRows } from "../calendar-rows";
import { DayEventsColumn } from "../components/day-events-column";
import { HoursColumn } from "../components/hours-column";
import { getEventOccurrenceDayKey } from "../utils";
import { DayWeekViewDraftOccurrence } from "./day-week-view-draft-occurrence";
import { DayWeekViewOccurrence } from "./day-week-view-occurrence";

const useDayView = () =>
  useCalendarStore(
    useShallow(({ selectedDate, groupedEventOccurrences }) => ({
      selectedDate,
      groupedEventOccurrences,
    })),
  );

export const DayView = () => {
  const { selectedDate, groupedEventOccurrences } = useDayView();

  const formattedDateKey = getEventOccurrenceDayKey(selectedDate);
  const dayOcurrences = groupedEventOccurrences?.[formattedDateKey] || [];

  console.log({ dayOcurrences });

  return (
    <div className="flex flex-col h-full gap-2 relative overflow-hidden">
      <div className="w-full flex items-center pl-[var(--left-spacing)]">
        <div className="w-12 text-text-sub text-sm shrink-0 mr-3" />
        <div className="flex flex-col w-16 items-center justify-center p-1">
          <p className="text-sm text-text-sub lowercase">
            {format(selectedDate, "iii")}
          </p>
          <p className="text-3xl font-medium text-text-default">
            {selectedDate.getDate()}
          </p>
        </div>

        <div className="flex-1" />
      </div>
      <div
        id="calendar-container"
        className="pl-[var(--left-spacing)] relative flex flex-col  overflow-y-scroll"
      >
        <div className="items-stretch flex flex-auto">
          <HoursColumn />
          <div className="flex flex-row w-full h-auto relative">
            <CalendarRows />
            <DayEventsColumn date={selectedDate}>
              {dayOcurrences?.map((occurrence) =>
                occurrence.isDraft ? (
                  <DayWeekViewDraftOccurrence
                    key={`draft-occurrence-${occurrence.eventOccurrenceId}`}
                    occurrence={occurrence}
                  />
                ) : (
                  <DayWeekViewOccurrence
                    key={`event-occurrence-${occurrence.eventOccurrenceId}`}
                    occurrence={occurrence}
                  />
                ),
              )}
            </DayEventsColumn>
          </div>
        </div>
      </div>
    </div>
  );
};
