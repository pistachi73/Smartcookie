import isNumber from "lodash/isNumber";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Temporal } from "temporal-polyfill";

import { generatePortalMetadata } from "@/shared/lib/generate-metadata";

import { Calendar } from "@/features/calendar/components";
import { isCalendarView } from "@/features/calendar/lib/calendar";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Calendar" });
};

const CalendarPage = async ({
  params,
}: PageProps<"/[locale]/portal/calendar/[calendarView]/[year]/[month]/[day]">) => {
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
