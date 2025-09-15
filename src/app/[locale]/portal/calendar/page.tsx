import { Calendar } from "@/features/calendar/components";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";

const CalendarPage = () => {
  return (
    <CalendarStoreProvider>
      <Calendar />
    </CalendarStoreProvider>
  );
};

export default CalendarPage;
