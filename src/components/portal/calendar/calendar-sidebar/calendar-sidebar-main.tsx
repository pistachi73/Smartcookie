"use client";

import { ResizablePanelRoot } from "@/components/ui/resizable-panel";

import {
  Calendar,
  Checkbox,
  CheckboxGroup,
  Disclosure,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { UpcomingEvent } from "../components/upcoming-event";

const useCalendarSidebarMain = () =>
  useCalendarStore(
    useShallow((store) => ({
      hubs: store.hubs,
      selectedDate: store.selectedDate,
      selectDate: store.selectDate,
    })),
  );

export const CalendarSidebarMain = () => {
  const { hubs, selectDate, selectedDate } = useCalendarSidebarMain();

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
    <div className="flex flex-col  rounded-lg gap-2">
      <div className="p-4 rounded-lg bg-overlay">
        <UpcomingEvent hubName="Math Tutoring Hub" />
      </div>
      <ResizablePanelRoot value="calendar">
        <div className="p-4 bg-overlay rounded-lg">
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

      <div className="px-4 py-2 bg-overlay rounded-lg">
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
      <div className="px-4 py-2 bg-overlay rounded-lg">
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
      </div>
    </div>
  );
};
