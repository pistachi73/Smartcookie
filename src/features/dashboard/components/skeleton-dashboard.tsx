"use client";

import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-card-skeleton";

import { SkeletonNextSession } from "./next-session/skeleton-next-session";
import { SkeletonWeeklyHoursChartCard } from "./weekly-hours-chart-card/skeleton-weekly-hours-chart-card";

export const SkeletonDashboard = () => {
  return (
    <div className="min-h-0 h-full w-full bg-bg p-5 space-y-4 overflow-y-auto">
      <PageHeader
        icon={DashboardSquare01Icon}
        title="Dashboard"
        subTitle="Welcome back to SmartCookie"
        className={{
          container: "p-0 border-none sm:p-0",
        }}
      />

      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <SkeletonNextSession />
          </div>

          <div className="flex flex-row gap-4">
            <div className="basis-1/2">
              <SkeletonWeeklyHoursChartCard />
            </div>
            <div className="basis-1/2">
              <div className="h-full border rounded-lg shadow-md p-4 bg-overlay" />
            </div>
          </div>
        </div>
        <div className="h-full">
          <AgendaSessionCardSkeleton />
        </div>
      </div>
    </div>
  );
};
