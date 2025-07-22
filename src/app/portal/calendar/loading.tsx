import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { CalendarSkeleton } from "@/features/calendar/components/calendar-skeleton";

const LoadingCalendarPage = () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Calendar", href: "/portal/calendar", icon: Calendar03Icon },
        ]}
      />
      <CalendarSkeleton />
    </>
  );
};

export default LoadingCalendarPage;
