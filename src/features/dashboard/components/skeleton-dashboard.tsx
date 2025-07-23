"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";

import { Heading } from "@/shared/components/ui/heading";
import { AgendaSessionCardSkeleton } from "@/shared/components/sessions/agenda-session-skeleton";

import { SkeletonNextSession } from "./next-session/skeleton-next-session";
import { SkeletonWeeklyHoursChartCard } from "./weekly-hours-chart-card/skeleton-weekly-hours-chart-card";

export const SkeletonDashboard = () => {
  return (
    <div className="min-h-0 h-full w-full bg-bg p-5 space-y-4 overflow-y-auto">
      <div className="flex items-center gap-x-4 mb-5">
        <div className="size-12 rounded-lg bg-overlay shadow-md flex items-center justify-center">
          <HugeiconsIcon
            icon={DashboardSquare01Icon}
            size={24}
            className="text-primary"
          />
        </div>
        <div className="flex flex-col">
          <Heading level={1}>Dashboard</Heading>
          <span className="text-muted-fg text-sm">
            Welcome back to SmartCookie
          </span>
        </div>
      </div>

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
