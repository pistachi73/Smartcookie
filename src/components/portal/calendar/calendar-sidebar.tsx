"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";

import { Checkbox } from "@/components/ui/checkbox";
import { ResizablePanelRoot } from "@/components/ui/resizable-panel";
import { es } from "date-fns/locale";
import { useCalendarContext } from "./calendar-context";
import { UpcomingEvent } from "./upcoming-event";

const Separator = () => {
  return <div className="h-px bg-border" />;
};

export const CalendarSidebar = () => {
  const { selectedDate, setSelectedDate, hubs } = useCalendarContext();

  return (
    <div className="flex flex-col">
      <div className="p-4">
        <UpcomingEvent hubName="Math Tutoring Hub" />
      </div>
      <Separator />
      <ResizablePanelRoot value="calendar">
        <Calendar
          required
          mode="single"
          onSelect={setSelectedDate}
          selected={selectedDate}
          // month={selectedDate}
          locale={es}
        />
      </ResizablePanelRoot>
      {/* <Calendar
        required
        mode="single"
        onSelect={setSelectedDate}
        selected={selectedDate}
        // month={selectedDate}
        locale={es}
      /> */}
      <Accordion type="multiple" className="max-w-full">
        <AccordionItem value="hubs">
          <AccordionTrigger>Hubs</AccordionTrigger>
          <AccordionContent className="ml-2 space-y-4">
            {hubs?.map((hub) => (
              <div
                key={hub.id}
                className="flex items-center text-sm dark:text-neutral-300 text-neutral-700 gap-2"
              >
                <Checkbox id={hub.id.toString()} />
                <label htmlFor={hub.id.toString()}>{hub.name}</label>
              </div>
            ))}
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
