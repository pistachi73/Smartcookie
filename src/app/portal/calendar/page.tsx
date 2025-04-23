import { Calendar } from "@/features/calendar/components";
import { getMonthSessionsQueryOptions } from "@/features/calendar/hooks/use-calendar-sessions";
import { CalendarStoreProvider } from "@/features/calendar/store/calendar-store-provider";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { currentUser } from "@/shared/lib/auth";
import { Calendar03Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Temporal } from "temporal-polyfill";

const CalendarPage = async () => {
  const queryClient = new QueryClient();
  const user = await currentUser();

  const now = Temporal.Now.plainDateTimeISO();
  await queryClient.prefetchQuery({
    ...getMonthSessionsQueryOptions(now, user!.id),
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Calendar", href: "/portal/calendar", icon: Calendar03Icon },
        ]}
      />
      <CalendarStoreProvider skipHydration={false}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Calendar />
        </HydrationBoundary>
      </CalendarStoreProvider>
    </>
  );
};

export default CalendarPage;
