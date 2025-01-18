"use client";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { CalendarView } from "@/stores/calendar-store";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/react";
import { useShallow } from "zustand/react/shallow";
import { formatCalendarHeaderTitle } from "./utils";

const useCalendarHeader = () =>
  useCalendarStore(
    useShallow((store) => ({
      onToday: store.onToday,
      selectedDate: store.selectedDate,
      setDate: store.selectDate,
      calendarView: store.calendarView,
      setCalendarView: store.setCalendarView,
      onNavigation: store.onNavigation,
    })),
  );

export const CalendarHeader = () => {
  const { selectedDate, calendarView, onToday, setCalendarView, onNavigation } =
    useCalendarHeader();

  const title = formatCalendarHeaderTitle(selectedDate, calendarView);

  return (
    <div className="flex flex-row items-center  justify-between px-4 py-4 pb-6 gap-6">
      <div className="flex flex-row items-center gap-3">
        <Button variant="outline" size="sm" onPress={onToday}>
          Today
        </Button>
        <div className="flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-sub"
            iconOnly
            onPress={() => {
              onNavigation(-1);
            }}
          >
            <ArrowLeft01Icon size={18} strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-sub"
            iconOnly
            onPress={() => {
              onNavigation(1);
            }}
          >
            <ArrowRight01Icon size={18} strokeWidth={1.5} />
          </Button>
        </div>
        <h2 className="text-2xl font-medium text-ellipsis line-clamp-1">
          {title}
        </h2>
      </div>
      <ToggleGroup
        type="single"
        value={calendarView}
        onValueChange={(value) => {
          if (!value) return;
          setCalendarView(value as CalendarView);
        }}
        defaultValue={calendarView}
        radioGroup="calendar-type"
      >
        <ToggleGroupItem value="day" size="sm">
          Day
        </ToggleGroupItem>
        <ToggleGroupItem value="week" size="sm">
          Week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" size="sm">
          Month
        </ToggleGroupItem>
        <ToggleGroupItem value="agenda" size="sm">
          Agenda
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
