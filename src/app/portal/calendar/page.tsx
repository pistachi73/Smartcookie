import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { Calendar } from "@/features/calendar/components";
import { CalendarStoreProvider } from "@/features/calendar/providers/calendar-store-provider";

const CalendarPage = async () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Calendar", href: "/portal/calendar", icon: Calendar03Icon },
        ]}
      />
      <CalendarStoreProvider>
        <Calendar />
      </CalendarStoreProvider>
    </>
  );
};

export default CalendarPage;
