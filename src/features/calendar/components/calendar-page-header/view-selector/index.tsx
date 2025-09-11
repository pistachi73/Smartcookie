import { SelectValue } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";

import { Select } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";
import type { CalendarView } from "@/features/calendar/types/calendar.types";
import { ViewSelectorTrigger } from "./view-selector-trigger";

export const ViewSelector = () => {
  const { calendarView, setCalendarView } = useCalendarStore(
    useShallow((store) => ({
      calendarView: store.calendarView,
      setCalendarView: store.setCalendarView,
    })),
  );

  return (
    <Select
      selectedKey={calendarView}
      onSelectionChange={(value) => {
        if (!value) return;
        setCalendarView(value as CalendarView);
      }}
      className="w-fit"
    >
      <ViewSelectorTrigger>
        <SelectValue />
      </ViewSelectorTrigger>

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
