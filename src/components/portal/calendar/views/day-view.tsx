import { useCalendarStore } from "@/providers/calendar-store-provider";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

import { CalendarRows } from "../calendar-rows";
import { HoursColumn } from "../components/hours-column";

const useDayView = () =>
  useCalendarStore(
    useShallow(
      ({
        setActiveSidebar,
        selectedDate,
        handleCalendarColumnDoubleClick,
      }) => ({
        selectedDate,
        setActiveSidebar,
        handleCalendarColumnDoubleClick,
      }),
    ),
  );

export const DayView = () => {
  const router = useRouter();
  const { selectedDate, handleCalendarColumnDoubleClick } = useDayView();

  console.log("daycalendar", selectedDate);

  const formattedDateKey = format(selectedDate, "yyyy-MM-dd");
  //   const dailyOccurrences = sessionOccurrences?.[formattedDateKey] || [];

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
              id="calendar-container"
              className="h-full w-full"
              onDoubleClick={(e) => {
                console.log("Hola");
                handleCalendarColumnDoubleClick(e, selectedDate);
              }}
            >
              {/* {dailyOccurrences?.map((occurrenceGroup) => {
                const columnWidth = 100 / occurrenceGroup.length;
                return occurrenceGroup.map((occurrence, index) => (
                  <SessionOccurrence
                    key={`${occurrence.id}-${index}`}
                    className="z-20 pr-2"
                    occurrence={occurrence}
                    style={{
                      width: `${columnWidth}%`,
                      left: `${index * columnWidth}%`, // Position each session in its own column
                    }}
                  />
                ));
              })} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
