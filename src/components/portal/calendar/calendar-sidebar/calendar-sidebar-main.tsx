"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Checkbox } from "@/components/ui/checkbox";
import { ResizablePanelRoot } from "@/components/ui/resizable-panel";

import { Calendar } from "@/components/ui/react-aria/calendar";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarDate } from "@internationalized/date";
import { useEffect, useState } from "react";
import { Separator } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";

const useCalendarSidebarMain = () =>
  useCalendarStore(
    useShallow((store) => ({
      selectedDate: store.selectedDate,
      selectDate: store.selectDate,
    })),
  );

export const CalendarSidebarMain = () => {
  const { selectDate, selectedDate } = useCalendarSidebarMain();

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
    <div className="flex flex-col">
      {/* <div className="p-4">
        <UpcomingEvent hubName="Math Tutoring Hub" />
      </div> */}
      <Separator />
      <ResizablePanelRoot value="calendar">
        <div className="py-4">
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

      <Accordion type="multiple" className="max-w-full">
        <AccordionItem value="hubs">
          <AccordionTrigger>Hubs</AccordionTrigger>
          <AccordionContent className="ml-2 space-y-4">
            {/* {hubs?.map((hub) => (
              <div
                key={hub.id}
                className="flex items-center text-sm dark:text-neutral-300 text-neutral-700 gap-2"
              >
                <Checkbox id={hub.id.toString()} />
                <label htmlFor={hub.id.toString()}>{hub.name}</label>
              </div>
            ))} */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="clients">
          <AccordionTrigger>Clients</AccordionTrigger>
          <AccordionContent className="ml-2">
            <div className="flex items-center text-sm dark:text-neutral-300 text-neutral-700 gap-2">
              <Checkbox id="client" />
              <label htmlFor="client">Client 1</label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
