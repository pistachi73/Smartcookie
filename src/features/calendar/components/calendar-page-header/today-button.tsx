"use client";

import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";

export const TodayButton = () => {
  const onToday = useCalendarStore(useShallow((store) => store.onToday));

  const today = new Date();
  const todayDay = today.getDate();

  return (
    <Button
      intent={"outline"}
      size={"md"}
      onPress={onToday}
      className={"size-9 @2xl:w-auto @2xl:h-10 text-sm"}
    >
      <span className="@2xl:hidden">{todayDay}</span>
      <span className="hidden @2xl:inline">Today</span>
    </Button>
  );
};
