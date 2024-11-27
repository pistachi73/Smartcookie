"use client";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SidebarLeft01Icon,
} from "@hugeicons/react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";
import { type CalendarType, useCalendarContext } from "./calendar-context";
import { useWeekCalendar } from "./hooks/use-week-calendar";

type CalendarHeaderProps = {
  title: string;
};

const onNavigationFunctionMapper: Record<CalendarType, any> = {
  day: addDays,
  week: addWeeks,
  month: addMonths,
};

export const CalendarHeader = () => {
  const { currentWeekMonthNames, currentYearNumber } = useWeekCalendar();
  const {
    calendarType,
    setIsSidebarOpen,
    setCalendarType,
    setSelectedDate,
    selectedDate,
  } = useCalendarContext();

  const onPrevious = () => {
    setSelectedDate((date) => {
      return onNavigationFunctionMapper[calendarType](date || new Date(), -1);
    });
  };

  const onNext = () => {
    setSelectedDate((date) => {
      return onNavigationFunctionMapper[calendarType](date || new Date(), 1);
    });
  };

  const onToday = () => {
    setSelectedDate(new Date());
  };

  const title = useMemo(() => {
    switch (calendarType) {
      case "day":
        return format(selectedDate, "d LLLL, yyyy");
      case "week":
        return `${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "d LLLL")} - ${format(
          endOfWeek(selectedDate, { weekStartsOn: 1 }),
          "d LLLL",
        )} ${format(selectedDate, "yyyy")}`;
      case "month":
        return format(selectedDate, "LLLL, yyyy");
      default:
        return "";
    }
  }, [calendarType, selectedDate]);

  return (
    <div className="flex flex-row items-center  justify-between px-6 py-4 gap-6">
      <div className="flex flex-row items-center gap-3">
        <Button
          variant="outline"
          iconOnly
          size="sm"
          onClick={() => {
            setIsSidebarOpen((open) => !open);
          }}
        >
          <SidebarLeft01Icon size={18} strokeWidth={1.5} />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <div className="flex">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-500"
            iconOnly
            onClick={onPrevious}
          >
            <ArrowLeft01Icon size={18} strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-500"
            iconOnly
            onClick={onNext}
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
        value={calendarType}
        onValueChange={(value) => {
          if (!value) return;
          setCalendarType(value as CalendarType);
        }}
        defaultValue={calendarType}
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
      </ToggleGroup>
    </div>
  );
};
