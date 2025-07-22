import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { Dashboard } from "@/features/dashboard/components";
import {
  getAgendaSessionsQueryOptions,
  getWeeklyHoursQueryOptions,
} from "@/features/dashboard/hooks/hook-options";
import { getNextSessionQueryOptions } from "@/features/dashboard/hooks/use-get-next-session";

const DashboardPage = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      getAgendaSessionsQueryOptions([new Date(), new Date()]),
    ),
    queryClient.prefetchQuery(
      getWeeklyHoursQueryOptions(new Date().toISOString()),
    ),
    queryClient.prefetchQuery(getNextSessionQueryOptions()),
  ]);

  const dehydratedState = dehydrate(queryClient);

  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          {
            label: "Dashboard",
            href: "/portal/dashboard",
            icon: DashboardSquare01Icon,
          },
        ]}
      />
      <HydrationBoundary state={dehydratedState}>
        <Dashboard />
      </HydrationBoundary>
    </>
  );
};

export default DashboardPage;
