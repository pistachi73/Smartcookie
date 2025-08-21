"use client";

import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/utils";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";

export const TodayButton = () => {
  const onToday = useCalendarStore(useShallow((store) => store.onToday));
  const { down } = useViewport();
  const isMobile = down("sm");

  const today = new Date();
  const todayDay = today.getDate();

  return (
    <Button
      intent={"outline"}
      size={isMobile ? "sq-sm" : "md"}
      onPress={onToday}
      className={cn(isMobile && "size-9 text-sm")}
    >
      {isMobile ? todayDay : "Today"}
    </Button>
  );
};
