import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";
import { Temporal } from "temporal-polyfill";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

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
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Calendar", href: "/portal/calendar", icon: Calendar03Icon },
        ]}
      />
      <CalendarStoreProvider
        initialCalendarStore={{
          calendarView,
          selectedDate: plainDateTime.toString(),
        }}
      >
        <Calendar />
      </CalendarStoreProvider>
    </>
  );
};

export default CalendarPage;
