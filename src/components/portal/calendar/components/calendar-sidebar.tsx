"use client";

import { ResizablePanelRoot } from "@/components/ui/resizable-panel";

import { Calendar } from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { UpcomingEvents } from "./upcoming-events";

const useCalendarSidebar = () =>
  useCalendarStore(
    useShallow((store) => ({
      hubs: store.hubs,
      selectedDate: store.selectedDate,
      selectDate: store.selectDate,
    })),
  );

export const CalendarSidebar = () => {
  const { hubs, selectDate, selectedDate } = useCalendarSidebar();

  const calendarValue = selectedDate
    ? new CalendarDate(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        selectedDate.getDate(),
      )
    : undefined;

  const [focusedDate, setFocusedDate] = useState<CalendarDate | undefined>(
    calendarValue,
  );

  useEffect(() => {
    if (!selectedDate) return;
    setFocusedDate(
      new CalendarDate(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        selectedDate.getDate(),
      ),
    );
  }, [selectedDate]);

  return (
    <div className="h-full max-h-[calc(100dvh-16px)]  shrink-0  relative transition-[width] duration-500 bg-overlay p-3 rounded-lg overflow-y-auto">
      <div className="flex flex-col  gap-4 relative">
        <UpcomingEvents />

        <div className="sticky bottom-0 left-0 h-full w-full">
          <ResizablePanelRoot value="calendar">
            <div className="p-2 bg-overlay-elevated rounded-lg sticky top-0 left-0 h-full w-full">
              <Calendar
                value={calendarValue}
                onChange={(date) => {
                  selectDate(date.toDate("UTC"));
                }}
                focusedValue={focusedDate}
                onFocusChange={setFocusedDate}
              />
            </div>
          </ResizablePanelRoot>
        </div>

        {/* <div className="px-2 py-0.5    rounded-lg">
          <Disclosure className="border-b-0">
            <DisclosureTrigger className="sm:text-base py-2">
              Hubs
            </DisclosureTrigger>
            <DisclosurePanel>
              <CheckboxGroup aria-label="Hubs" className={"ml-1"}>
                {hubs.map((hub) => (
                  <Checkbox key={hub.id} value={hub.id.toString()}>
                    {hub.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </DisclosurePanel>
          </Disclosure>
        </div>
        <div className="px-2 py-0.5 rounded-lg">
          <Disclosure className="border-b-0">
            <DisclosureTrigger className="sm:text-base py-2">
              Clients
            </DisclosureTrigger>
            <DisclosurePanel>
              <CheckboxGroup aria-label="Clients" className={"ml-1"}>
                {hubs.map((hub) => (
                  <Checkbox key={hub.id} value={hub.id.toString()}>
                    {hub.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </DisclosurePanel>
          </Disclosure>
        </div> */}
      </div>
    </div>
  );
};
