import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Temporal } from "temporal-polyfill";
import { useCalendarStore } from "../store/calendar-store-provider";
import { getMonthSessionsQueryOptions } from "./use-calendar-sessions";

export const usePrefetchAdjacentPeriod = () => {
  const queryClient = useQueryClient();
  const selectedDate = useCalendarStore((store) => store.selectedDate);

  // Prefetch adjacent periods when needed
  const prefetchAdjacentPeriod = React.useCallback(
    (direction: "prev" | "next") => {
      const selectedDateTime = Temporal.PlainDateTime.from(selectedDate);
      const adjecentPeriod = selectedDateTime.add({
        months: direction === "prev" ? -1 : 1,
      });

      queryClient.prefetchQuery(getMonthSessionsQueryOptions(adjecentPeriod));
    },
    [selectedDate, queryClient],
  );

  return {
    prefetchAdjacentPeriod,
  };
};
