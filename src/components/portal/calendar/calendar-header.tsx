"use client";
import { Button } from "@/components/ui/button";
import { ListBox, ListBoxItem } from "@/components/ui/react-aria/list-box";
import { Popover } from "@/components/ui/react-aria/popover";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import type { CalendarView } from "@/stores/calendar-store";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/react";
import { Select, SelectValue } from "react-aria-components";
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
        <h2 className="text-xl font-medium text-ellipsis line-clamp-1">
          {title}
        </h2>
      </div>

      <Select
        placeholder="Select an option"
        selectedKey={calendarView}
        onSelectionChange={(value) => {
          if (!value) return;
          setCalendarView(value as CalendarView);
        }}
      >
        <Button variant={"outline"} size={"sm"}>
          <SelectValue className={"data-[placeholder]:text-text-sub"} />
          <ArrowDown01Icon size={16} />
        </Button>
        <Popover
          className="min-w-[--trigger-width] w-[200px]"
          placement="bottom right"
        >
          <ListBox
            items={[
              {
                id: "day",
                textValue: "Day",
              },
              {
                id: "week",
                textValue: "Week",
              },
              {
                id: "month",
                textValue: "Month",
              },
              {
                id: "agenda",
                textValue: "Agenda",
              },
            ]}
          >
            {(item) => (
              <ListBoxItem key={item.id} id={item.id}>
                {item.textValue}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </Select>
    </div>
  );
};
