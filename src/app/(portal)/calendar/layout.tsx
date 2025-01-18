import { VERCEL_HEADERS } from "@/app-config";
import { getCalendarDataAction } from "@/components/portal/calendar/actions";
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

  const [, , calendarView, yearOrEventId, month, day] = pathname.split("/");

  console.log(pathname);

  if (!isCalendarView(calendarView)) {
    if (isNumber(yearOrEventId)) {
      return {
        skipHydration: false,
        initialCalendarStore: {
          editingEventOccurrenceId: Number(yearOrEventId),
          activeSidebar: "edit-session",
        },
      };
    }
    return {
      skipHydration: false,
    };
  }

  if (!isNumber(yearOrEventId) || !isNumber(month) || !isNumber(day)) {
    return {
      skipHydration: false,
    };
  }

  return {
    skipHydration: true,
    initialCalendarStore: {
      _isHydrated: true,
      calendarView,
      selectedDate: new Date(
        Number(yearOrEventId),
        Number(month) - 1,
        Number(day),
      ),
    },
  };
};

const CalendarLayout = async ({ children }: { children: React.ReactNode }) => {
  const res = await getCalendarDataAction();
  const parsedHeaders = await headers();

  const { hubs, eventOcurrences } = res?.data ?? {};

  const pathName = parsedHeaders.get(VERCEL_HEADERS.PATHNAME);

  const { initialCalendarStore, skipHydration } =
    parseCalendarLayoutPathname(pathName);

  return (
    <CalendarStoreProvider
      initialCalendarStore={{
        ...initialCalendarStore,
        hubs,
        eventOccurrences: eventOcurrences,
      }}
      skipHydration={skipHydration}
    >
      {children}
    </CalendarStoreProvider>
  );
};

export default CalendarLayout;
