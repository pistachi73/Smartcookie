import { Calendar } from "@/features/calendar/components";
import { getMonthSessionsQueryOptions } from "@/features/calendar/hooks/use-calendar-sessions";
import { isCalendarView } from "@/features/calendar/lib/calendar";
import { CalendarStoreProvider } from "@/features/calendar/store/calendar-store-provider";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { currentUser } from "@/shared/lib/auth";
import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";
import { Temporal } from "temporal-polyfill";

type CalendarPageProps = {
  params: Promise<{
    calendarView: string;
    year: string;
    month: string;
    day: string;
  }>;
};
const CalendarPage = async ({ params }: CalendarPageProps) => {
  const queryClient = new QueryClient();
  const user = await currentUser();
  const { calendarView, year, month, day } = await params;

  console.log(
    calendarView,
    year,
    month,
    day,
    isCalendarView(calendarView),
    isNumber(year),
  );

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

  const today = Temporal.Now.plainDateTimeISO();
  const isDifferentMonth =
    today.month !== plainDateTime.month ||
    (today.month === plainDateTime.month && today.year !== plainDateTime.year);

  await Promise.all([
    queryClient.prefetchQuery({
      ...getMonthSessionsQueryOptions(plainDateTime, user!.id),
      staleTime: 1000 * 60 * 60 * 24,
    }),
    ...(isDifferentMonth
      ? [
          queryClient.prefetchQuery({
            ...getMonthSessionsQueryOptions(today, user!.id),
            staleTime: 1000 * 60 * 60 * 24,
          }),
        ]
      : []),
  ]);

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
          _isHydrated: true,
          selectedDate: plainDateTime.toString(),
        }}
        skipHydration={true}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Calendar />
        </HydrationBoundary>
      </CalendarStoreProvider>
    </>
  );
};

export default CalendarPage;
