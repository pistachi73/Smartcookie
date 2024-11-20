"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";

import { Checkbox } from "@/components/ui/checkbox";
import { es } from "date-fns/locale";
import { useCalendarContext } from "./calendar-context";
import { UpcomingEvent } from "./upcoming-event";

const Separator = () => {
  return <div className="h-px bg-border" />;
};

export const CalendarSidebar = () => {
  const { selectedDate, setSelectedDate } = useCalendarContext();

  return (
    <div className="flex flex-col border-r border-border">
      <div className="p-4">
        <UpcomingEvent hubName="Math Tutoring Hub" />
      </div>
      <Separator />
      <Calendar
        required
        mode="single"
        onSelect={setSelectedDate}
        selected={selectedDate}
        month={selectedDate}
        locale={es}
      />
      <Accordion type="multiple" className="max-w-full">
        <AccordionItem value="hubs">
          <AccordionTrigger>Hubs</AccordionTrigger>
          <AccordionContent className="ml-2">
            <div className="flex items-center text-sm dark:text-neutral-300 text-neutral-700 gap-2">
              <Checkbox id="terms" />
              <label htmlFor="terms">Hub 1</label>
            </div>
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
