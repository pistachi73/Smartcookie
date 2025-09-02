import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { PageHeader } from "@/shared/components/layout/page-header";

import { getNextSession } from "@/data-access/sessions/queries";
import { AgendaCard } from "@/features/dashboard/components/agenda-card";
import { NextSession } from "@/features/dashboard/components/next-session";
import { WeeklyHoursCard } from "@/features/dashboard/components/weekly-hours-chart-card";
import { SkeletonWeeklyHoursChartCard } from "@/features/dashboard/components/weekly-hours-chart-card/skeleton-weekly-hours-chart-card";
import { getWeeklyHoursQueryOptions } from "@/features/dashboard/hooks/hook-options";
import { getNextSessionQueryOptions } from "@/features/dashboard/lib/get-next-session-query-options";
import { getWeeklyHoursUseCase } from "@/features/dashboard/use-cases/dashboard.use-case";

const DashboardPage = async () => {
  const queryClient = new QueryClient();
  const now = new Date();
  const [nextSession, weeklyHours] = await Promise.all([
    getNextSession(),
    getWeeklyHoursUseCase({ date: now.toISOString() }),
  ]);

  queryClient.setQueryData(getNextSessionQueryOptions().queryKey, nextSession);
  queryClient.setQueryData(
    getWeeklyHoursQueryOptions(now.toISOString()).queryKey,
    weeklyHours,
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-0 h-full w-full bg-bg p-4 sm:p-6 sm:space-y-4 space-y-6 overflow-y-auto @container">
        <PageHeader
          icon={DashboardSquare01Icon}
          title="Dashboard"
          subTitle="Welcome back to SmartCookie"
          className={{
            container: "p-0 border-none sm:p-0",
          }}
        />

        <div className="grid grid-cols-1 @4xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6 col-span-1 @4xl:col-span-2">
            <div>
              <NextSession />
            </div>

            <Suspense fallback={<SkeletonWeeklyHoursChartCard />}>
              <WeeklyHoursCard />
            </Suspense>
          </div>

          <div className="col-span-1">
            <AgendaCard />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default DashboardPage;
