"use client";

import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

import { AgendaCardSkeleton } from "./agenda-card/agenda-card-skeleton";
import { SkeletonNextSession } from "./next-session/skeleton-next-session";
import { SkeletonWeeklyHoursChartCard } from "./weekly-hours-chart-card/skeleton-weekly-hours-chart-card";

export const SkeletonDashboard = () => {
  return (
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
            <SkeletonNextSession />
          </div>

          <div>
            <SkeletonWeeklyHoursChartCard />
          </div>
        </div>

        <div className="col-span-1 ">
          <AgendaCardSkeleton />
        </div>
      </div>
    </div>
  );
};
