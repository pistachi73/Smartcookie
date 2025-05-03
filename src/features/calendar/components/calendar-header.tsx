"use client";
import { formatCalendarHeaderTitle } from "@/features/calendar/lib/utils";
import { useCalendarStore } from "@/features/calendar/store/calendar-store-provider";
import type { CalendarView } from "@/features/calendar/types/calendar.types";
import { Heading } from "@/shared/components/ui/heading";
import { Button } from "@/ui/button";
import { Select } from "@/ui/select";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SidebarRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useShallow } from "zustand/react/shallow";
const useCalendarHeader = () =>
  useCalendarStore(
    useShallow((store) => ({
      onToday: store.onToday,
      selectedDate: store.selectedDate,
      setDate: store.selectDate,
      calendarView: store.calendarView,
      setCalendarView: store.setCalendarView,
      onNavigation: store.onNavigation,
      toggleSidebar: store.toggleSidebar,
    })),
  );

export const CalendarHeader = () => {
  const {
    selectedDate,
    calendarView,
    onToday,
    setCalendarView,
    onNavigation,
    toggleSidebar,
  } = useCalendarHeader();

  const title = formatCalendarHeaderTitle(
    selectedDate,
    calendarView === "weekday" ? "week" : calendarView,
  );

  return (
    <div className="w-full flex flex-row items-center justify-between p-4 py-3 gap-6 border-b">
      <div className="flex flex-row items-center gap-3">
        <Heading level={2} className="text-ellipsis line-clamp-1">
          {title}
        </Heading>
      </div>

      <div className="flex flex-row gap-2">
        <div className="flex">
          <Button
            intent="plain"
            className="size-9 p-0 text-muted-fg hover:text-current"
            onPress={() => {
              onNavigation(-1);
            }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
          </Button>
          <Button
            intent="plain"
            className="size-9 p-0 text-muted-fg hover:text-current"
            onPress={() => {
              onNavigation(1);
            }}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
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
            className="min-w-[60px] h-9 w-fit px-4 hover:bg-secondary"
          />
          <Select.List
            className={{
              popover: "w-[180px]!",
            }}
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
          intent="outline"
          size="small"
          shape="square"
          onPress={onToday}
          className="h-9"
        >
          Today
        </Button>
        <Button
          intent="outline"
          shape="square"
          size="square-petite"
          className="size-9"
          onPress={() => {
            toggleSidebar();
          }}
          aria-label="Toggle sidebar"
        >
          <HugeiconsIcon icon={SidebarRight01Icon} size={18} data-slot="icon" />
        </Button>
      </div>
    </div>
  );
};
