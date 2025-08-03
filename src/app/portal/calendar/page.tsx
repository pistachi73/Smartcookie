import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { Calendar } from "@/features/calendar/components";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";
import { OptimizedCalendarProvider } from "@/features/calendar/providers/optimized-calendar-provider";

const CalendarPage = async () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Calendar", href: "/portal/calendar", icon: Calendar03Icon },
        ]}
      />
      <CalendarStoreProvider skipHydration={false}>
        <OptimizedCalendarProvider>
          <Calendar />
        </OptimizedCalendarProvider>
      </CalendarStoreProvider>
    </>
  );
};

export default CalendarPage;
