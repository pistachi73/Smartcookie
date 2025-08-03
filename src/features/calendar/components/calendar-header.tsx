"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SidebarRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { SelectValue } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";

import { Heading } from "@/shared/components/ui/heading";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/ui/button";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useCalendarHeaderTitle } from "@/features/calendar/hooks/use-calendar-header-title";
import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import type { CalendarView } from "@/features/calendar/types/calendar.types";
import { cn } from "@/lib/utils";

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
  const { down } = useViewport();

  const { title } = useCalendarHeaderTitle({
    selectedDate,
    calendarView: calendarView === "weekday" ? "week" : calendarView,
  });

  const today = new Date();
  const todayDay = today.getDate();
  const isMobile = down("sm");

  return (
    <div className="w-full flex flex-row items-center justify-between p-4 py-3 gap-6 border-b">
      <div className="flex flex-row items-center gap-3">
        <Heading level={2} className="text-ellipsis line-clamp-1">
          {title}
        </Heading>
      </div>

      <div className="flex flex-row sm:gap-2">
        <div className="flex items-center">
          <Button
            intent="plain"
            size="square-petite"
            className="size-9 p-0 sm:text-muted-fg hover:text-current"
            onPress={() => {
              onNavigation(-1);
            }}
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="size-4 sm:size-4.5"
            />
          </Button>
          <Button
            intent="plain"
            size="square-petite"
            className="size-9 p-0 sm:text-muted-fg hover:text-current"
            onPress={() => {
              onNavigation(1);
            }}
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="size-4 sm:size-4.5"
            />
          </Button>
        </div>
        <Select
          selectedKey={calendarView}
          onSelectionChange={(value) => {
            if (!value) return;
            setCalendarView(value as CalendarView);
          }}
        >
          <Button size="small" intent={isMobile ? "plain" : "outline"}>
            <SelectValue />
          </Button>
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
              <Select.Option
                id={item.id}
                textValue={item.name}
                className={cn("text-sm")}
              >
                {item.name}
              </Select.Option>
            )}
          </Select.List>
        </Select>
        <Button
          intent={"outline"}
          size={isMobile ? "square-petite" : "small"}
          shape="square"
          onPress={onToday}
          className={cn("h-9", isMobile && "size-9 text-sm")}
        >
          {isMobile ? todayDay : "Today"}
        </Button>
        {!isMobile && (
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
            <HugeiconsIcon
              icon={SidebarRight01Icon}
              size={18}
              data-slot="icon"
            />
          </Button>
        )}
      </div>
    </div>
  );
};
