import { VERCEL_HEADERS } from "@/core/config/app-config";
import { getCalendarDataAction } from "@/features/calendar/actions";
import { CalendarStoreProvider } from "@/features/calendar/store/calendar-store-provider";
import type { InitialCalendarStateData } from "@/features/calendar/types/calendar-store.types";
import type { CalendarView } from "@/features/calendar/types/calendar.types";
import { headers } from "next/headers";
import { Temporal } from "temporal-polyfill";

const isCalendarView = (
  calendarView?: string,
): calendarView is CalendarView => {
  return (
    calendarView === "day" ||
    calendarView === "week" ||
    calendarView === "month" ||
    calendarView === "weekday" ||
    calendarView === "agenda"
  );
};

const isNumber = (value: string | undefined): value is string => {
  return value !== undefined && !Number.isNaN(Number(value));
};

const parseCalendarLayoutPathname = (
  pathname: string | null,
): {
  skipHydration: boolean;
  initialCalendarStore?: InitialCalendarStateData;
} => {
  if (!pathname) return { skipHydration: false };

  const [, , , calendarView, yearOrEventId, month, day] = pathname.split("/");

  console.log(pathname, calendarView, yearOrEventId, month, day);

  if (!isCalendarView(calendarView)) {
    return {
      skipHydration: false,
    };
  }

  if (!isNumber(yearOrEventId) || !isNumber(month) || !isNumber(day)) {
    return {
      skipHydration: false,
    };
  }

  const selectedDate = new Temporal.PlainDate(
    Number(yearOrEventId),
    Number(month),
    Number(day),
  );

  return {
    skipHydration: true,
    initialCalendarStore: {
      _isHydrated: true,
      calendarView,
      selectedDate: selectedDate.toString(),
    },
  };
};

const CalendarLayout = async ({ children }: { children: React.ReactNode }) => {
  const res = await getCalendarDataAction();

  const parsedHeaders = await headers();

  const { hubs, events, occurrences } = res?.data ?? {};

  const pathName = parsedHeaders.get(VERCEL_HEADERS.PATHNAME);

  const { initialCalendarStore, skipHydration } =
    parseCalendarLayoutPathname(pathName);

  // Create a stable reference for the initialCalendarStore props
  const storeProps = {
    initialCalendarStore: {
      ...initialCalendarStore,
      hubs,
      events,
      occurrences,
    },
    skipHydration,
  };

  return (
    <CalendarStoreProvider
      initialCalendarStore={storeProps.initialCalendarStore}
      skipHydration={storeProps.skipHydration}
    >
      {children}
    </CalendarStoreProvider>
  );
};

export default CalendarLayout;
