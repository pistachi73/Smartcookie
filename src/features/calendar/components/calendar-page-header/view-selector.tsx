"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  CalendarSetting02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { SelectValue } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/utils";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import type { CalendarView } from "@/features/calendar/types/calendar.types";

export const ViewSelector = () => {
  const { calendarView, setCalendarView } = useCalendarStore(
    useShallow((store) => ({
      calendarView: store.calendarView,
      setCalendarView: store.setCalendarView,
    })),
  );
  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <Select
      selectedKey={calendarView}
      onSelectionChange={(value) => {
        if (!value) return;
        setCalendarView(value as CalendarView);
      }}
      className="w-fit"
    >
      <Button
        size={isMobile ? "sq-md" : "md"}
        intent={isMobile ? "plain" : "outline"}
        className={cn(isMobile && "size-9")}
      >
        {isMobile ? (
          <HugeiconsIcon icon={CalendarSetting02Icon} size={18} />
        ) : (
          <>
            <SelectValue />
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              aria-hidden
              data-slot="icon"
              className="size-4 shrink-0 text-muted-fg duration-300 group-data-open:rotate-180 group-data-open:text-fg"
            />
          </>
        )}
      </Button>
      <Select.List
        popover={{
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
  );
};
