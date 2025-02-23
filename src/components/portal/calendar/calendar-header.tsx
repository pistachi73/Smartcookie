"use client";
import { Button, Select } from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/react";
import { useShallow } from "zustand/react/shallow";
import type { CalendarView } from "./calendar.types";
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

  const title = formatCalendarHeaderTitle(
    selectedDate,
    calendarView === "weekday" ? "week" : calendarView,
  );

  return (
    <div className="w-full flex flex-row items-center justify-between p-4 gap-6 border-b">
      <div className="flex flex-row items-center gap-3">
        <h2 className="text-2xl font-semibold text-ellipsis line-clamp-1">
          {title}
        </h2>
      </div>

      <div className="flex flex-row gap-2">
        <div className="flex">
          <Button
            appearance="plain"
            className="size-10 p-0 text-muted-fg hover:text-current"
            onPress={() => {
              onNavigation(-1);
            }}
          >
            <ArrowLeft01Icon size={18} strokeWidth={1.5} />
          </Button>
          <Button
            appearance="plain"
            className="size-10 p-0 text-muted-fg hover:text-current"
            onPress={() => {
              onNavigation(1);
            }}
          >
            <ArrowRight01Icon size={18} strokeWidth={1.5} />
          </Button>
        </div>
        <Select
          defaultSelectedKey={calendarView}
          onSelectionChange={(value) => {
            if (!value) return;
            setCalendarView(value as CalendarView);
          }}
        >
          <Select.Trigger
            showArrow
            className="min-w-[60px] w-fit px-4 hover:bg-secondary"
          />
          <Select.List
            popoverProps={{
              placement: "bottom right",
            }}
            items={[
              {
                id: "day",
                name: "Day",
              },
              {
                id: "weekday",
                name: "Weekdays",
              },
              {
                id: "week",
                name: "Week",
              },
              {
                id: "month",
                name: "Month",
              },
              {
                id: "agenda",
                name: "Agenda",
              },
            ]}
          >
            {(item) => (
              <Select.Option id={item.id} textValue={item.name}>
                {item.name}
              </Select.Option>
            )}
          </Select.List>
        </Select>
        <Button
          appearance="outline"
          size="small"
          shape="square"
          onPress={onToday}
        >
          Today
        </Button>

        <Button size="small" shape="square" className={"shrink-0"}>
          Add Event
        </Button>
      </div>
    </div>
  );
};
