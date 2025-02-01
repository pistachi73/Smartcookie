"use client";
import { Button, Select } from "@/components/ui/new/ui";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { CalendarView } from "@/stores/calendar-store";
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
    <div className="w-full flex flex-row items-center justify-between px-4 py-4 pb-6 gap-6">
      <div className="flex flex-row items-center gap-3">
        <Button appearance="outline" size="small" onPress={onToday}>
          Today
        </Button>
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
        <h2 className="text-2xl font-semibold text-ellipsis line-clamp-1">
          {title}
        </h2>
      </div>

      <div>
        <Select
          defaultSelectedKey={calendarView}
          onSelectionChange={(value) => {
            if (!value) return;
            setCalendarView(value as CalendarView);
          }}
        >
          <Select.Trigger
            showArrow
            className="rounded-full min-w-[60px] w-fit px-4"
          />
          <Select.List
            placement="bottom right"
            items={[
              {
                id: "day",
                name: "Day",
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
      </div>
      {/* <Select
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
            items={}
          >
            {(item) => (
              <ListBoxItem key={item.id} id={item.id}>
                {item.textValue}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </Select> */}
    </div>
  );
};
