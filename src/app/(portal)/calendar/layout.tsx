import { VERCEL_HEADERS } from "@/app-config";
import { getCalendarHubsByUserIdAction } from "@/components/portal/calendar/actions";
import { CalendarStoreProvider } from "@/providers/calendar-store-provider";
import type { CalendarStore, CalendarView } from "@/stores/calendar-store";
import { headers } from "next/headers";

const isCalendarView = (
  calendarView?: string,
): calendarView is CalendarView => {
  return (
    calendarView === "day" ||
    calendarView === "week" ||
    calendarView === "month" ||
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
  initialCalendarStore?: Partial<CalendarStore>;
} => {
  if (!pathname) return { skipHydration: false };

  const [, , calendarView, year, month, day] = pathname.split("/");

  console.log(calendarView);

  if (!isCalendarView(calendarView)) {
    return {
      skipHydration: false,
    };
  }

  if (!isNumber(year) || !isNumber(month) || !isNumber(day)) {
    return {
      skipHydration: false,
    };
  }

  return {
    skipHydration: true,
    initialCalendarStore: {
      _isHydrated: true,
      calendarView,
      selectedDate: new Date(Number(year), Number(month) - 1, Number(day)),
    },
  };
};

const CalendarLayout = async ({ children }: { children: React.ReactNode }) => {
  const a = await getCalendarHubsByUserIdAction();
  const parsedHeaders = await headers();
  const pathName = parsedHeaders.get(VERCEL_HEADERS.PATHNAME);

  const { initialCalendarStore, skipHydration } =
    parseCalendarLayoutPathname(pathName);

  return (
    <CalendarStoreProvider
      initialCalendarStore={initialCalendarStore}
      skipHydration={skipHydration}
    >
      {children}
    </CalendarStoreProvider>
  );
};

export default CalendarLayout;
