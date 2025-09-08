import { QueryClient } from "@tanstack/react-query";

import { Calendar } from "@/features/calendar/components";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";
import { createCalendarCacheManager } from "../../../features/calendar/lib/calendar-cache";

const CalendarPage = () => {
  const queryClient = new QueryClient();
  const manager = createCalendarCacheManager(queryClient);

  console.log(manager.getStats());
  return (
    <CalendarStoreProvider>
      <Calendar />
    </CalendarStoreProvider>
  );
};

export default CalendarPage;
