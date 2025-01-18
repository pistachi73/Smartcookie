import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useShallow } from "zustand/react/shallow";

import { CalendarRows } from "../calendar-rows";
import { HoursColumn } from "../components/hours-column";
import {
  calculateOccurrenceHeight,
  calculateOccurrenceTop,
  getEventOccurrenceDayKey,
} from "../utils";
import { DayWeekViewOccurrence } from "./day-week-view-occurrence";

const useDayView = () =>
  useCalendarStore(
    useShallow(
      ({
        setActiveSidebar,
        selectedDate,
        handleCalendarColumnDoubleClick,
        groupedEventOccurrences,
        draftEventOccurrence,
        editingEventOccurrenceId,
      }) => ({
        selectedDate,
        setActiveSidebar,
        groupedEventOccurrences,
        editingEventOccurrenceId,
        draftEventOccurrence,
        handleCalendarColumnDoubleClick,
      }),
    ),
  );

export const DayView = () => {
  const {
    selectedDate,
    handleCalendarColumnDoubleClick,
    groupedEventOccurrences,
    draftEventOccurrence,
  } = useDayView();

  const formattedDateKey = getEventOccurrenceDayKey(selectedDate);
  const dayOcurrences = groupedEventOccurrences?.[formattedDateKey] || [];

  return (
    <div className="flex flex-col h-full gap-2 relative overflow-hidden">
      <div className="w-full flex items-center pl-[var(--left-spacing)]">
        <div className="w-12 text-text-sub text-sm shrink-0 mr-3" />
        <div className="flex flex-col w-16 items-center justify-center p-1">
          <p className="text-sm text-text-sub lowercase">
            {format(selectedDate, "iii")}
          </p>
          <p className="text-3xl font-medium text-text-base">
            {selectedDate.getDate()}
          </p>
        </div>

        <div className="h-full px-2" />
      </div>
      <div className="pl-[var(--left-spacing)] relative flex flex-col overflow-y-scroll">
        <div className="items-stretch flex flex-auto">
          <HoursColumn />
          <div className="flex flex-row w-full h-auto relative">
            <CalendarRows />
            <div
              className="h-full w-full"
              onClick={(e) => {
                console.log("hola");
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                handleCalendarColumnDoubleClick(e, selectedDate);
              }}
            >
              {dayOcurrences?.map((eventOcurrences) =>
                eventOcurrences.map((occurrence, index) => {
                  const widthPercentage = 100 / eventOcurrences.length;
                  const topPercentage = calculateOccurrenceTop(
                    occurrence.startTime,
                  );
                  const heightPercentage = calculateOccurrenceHeight(
                    occurrence.startTime,
                    occurrence.endTime,
                  );

                  return (
                    <DayWeekViewOccurrence
                      key={`event-occurrence-${occurrence.eventOccurrenceId}`}
                      occurrence={occurrence}
                      style={{
                        top: `${topPercentage}%`,
                        height: `${heightPercentage}%`,
                        width: `${widthPercentage}%`,
                        left: `${index * widthPercentage}%`,
                      }}
                    />
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
