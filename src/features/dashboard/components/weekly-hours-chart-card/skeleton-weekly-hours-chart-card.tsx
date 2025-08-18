"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { SkeletonBarChart } from "@/shared/components/ui/chart/skeleton-bar-chart";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Heading } from "@/shared/components/ui/heading";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function SkeletonWeeklyHoursChartCard() {
  const now = today(getLocalTimeZone());
  return (
    <div className="border bg-overlay rounded-lg shadow-sm p-4 space-y-4">
      <div className="flex flex-row items-center justify-between">
        <Heading level={4} className="text-base font-semibold">
          Weekly teaching hours
        </Heading>
        <DatePicker
          defaultValue={now}
          overlayProps={{
            placement: "bottom end",
          }}
          className={{
            fieldGroup: "h-8",
            input:
              "h-8 px-[calc(var(--spacing)*2.7)] text-xs/4 lg:text-[0.800rem]/4",
          }}
        />
      </div>
      <div className="space-y-6">
        <div className="flex flex-row items-center justify-between">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-8 w-12" />
        </div>
        {/* <Skeleton className="h-48 w-full" /> */}
        <SkeletonBarChart className="aspect-2/1" />
      </div>
    </div>
  );
}
