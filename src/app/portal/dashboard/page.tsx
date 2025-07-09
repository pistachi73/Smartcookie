import { Dashboard } from "@/features/dashboard/components";
import {
  getAgendaSessionsQueryOptions,
  getWeeklyHoursQueryOptions,
} from "@/features/dashboard/hooks/hook-options";
import { getNextSessionQueryOptions } from "@/features/dashboard/hooks/use-get-next-session";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { currentUser } from "@/shared/lib/auth";
import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

const DashboardPage = async () => {
  const queryClient = new QueryClient();
  const user = await currentUser();

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
