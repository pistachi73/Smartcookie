import { CalendarSkeleton } from "@/features/calendar/components/calendar-skeleton";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";

export default function CalendarLoading() {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          {
            label: "Portal",
            href: "/portal",
          },
          {
            label: "Calendar",
            href: "/portal/calendar",
            icon: Calendar03Icon,
          },
        ]}
      />
      <CalendarSkeleton />
    </>
  );
}
