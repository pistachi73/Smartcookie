import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";
import { Temporal } from "temporal-polyfill";

import { Calendar } from "@/features/calendar/components";
import { isCalendarView } from "@/features/calendar/lib/calendar";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";

type CalendarPageProps = {
  params: Promise<{
    calendarView: string;
    year: string;
    month: string;
    day: string;
  }>;
};
const CalendarPage = async ({ params }: CalendarPageProps) => {
  const { calendarView, year, month, day } = await params;

  if (
    !isCalendarView(calendarView) ||
    !isNumber(Number(year)) ||
    !isNumber(Number(month)) ||
    !isNumber(Number(day))
  ) {
    redirect("/portal/calendar");
  }

  const plainDateTime = new Temporal.PlainDateTime(
    Number(year),
    Number(month),
    Number(day),
  );

  return (
    <CalendarStoreProvider
      initialCalendarStore={{
        calendarView,
        selectedDate: plainDateTime.toString(),
      }}
    >
      <Calendar />
    </CalendarStoreProvider>
  );
};

export default CalendarPage;
