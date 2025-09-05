import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { getNextSession, getWeeklyHours } from "@/data-access/sessions/queries";
import { Dashboard } from "@/features/dashboard/components";
import { getWeeklyHoursQueryOptions } from "@/features/dashboard/hooks/hook-options";
import { getNextSessionQueryOptions } from "@/features/dashboard/lib/get-next-session-query-options";

const DashboardPage = async () => {
  const queryClient = new QueryClient();
  const now = new Date();

  const [nextSession, weeklyHours] = await Promise.all([
    getNextSession(),
    getWeeklyHours({ date: now.toISOString() }),
  ]);

  queryClient.setQueryData(getNextSessionQueryOptions().queryKey, nextSession);
  queryClient.setQueryData(
    getWeeklyHoursQueryOptions(now.toISOString()).queryKey,
    weeklyHours,
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Dashboard />
    </HydrationBoundary>
  );
};

export default DashboardPage;
