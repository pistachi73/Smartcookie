"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Card } from "@/shared/components/ui/card";
import { SkeletonBarChart } from "@/shared/components/ui/chart/skeleton-bar-chart";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tooltip } from "@/shared/components/ui/tooltip";

import { useGetWeeklyHours } from "../../hooks/use-get-weekly-hours";

const DynamicWeeklyHoursCard = dynamic(
  () => import("./weekly-hours-chart").then((mod) => mod.WeeklyHoursCard),
  {
    ssr: true,
    loading: () => <SkeletonBarChart className="aspect-video" />,
  },
);

export function WeeklyHoursCard() {
  const [date, setDate] = useState(today(getLocalTimeZone()));
  const { data: chartData, isPending } = useGetWeeklyHours(
    date.toDate(getLocalTimeZone()).toISOString(),
  );

  const hours = Math.floor(chartData?.totalHours ?? 0);
  const minutes = Math.round(((chartData?.totalHours ?? 0) - hours) * 60);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Weekly teaching hours</Card.Title>
        <Card.Action>
          <DatePicker
            onChange={(value) => value && setDate(value)}
            value={date}
            overlayProps={{
              placement: "bottom end",
            }}
            className={{
              fieldGroup: "h-9",
              input: "text-xs/4 lg:text-sm",
            }}
          />
        </Card.Action>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          {isPending ? (
            <>
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-8 w-12" />
            </>
          ) : (
            <>
              <p className="text-3xl font-bold">
                {hours}
                <span className="text-muted-fg text-base">h</span>
                {minutes > 0 && (
                  <>
                    {" "}
                    {minutes}
                    <span className="text-muted-fg text-base">m</span>
                  </>
                )}
              </p>
              <Tooltip delay={0} closeDelay={0}>
                <Tooltip.Trigger className="text-sm text-muted-fg hover:text-fg transition-colors">
                  View hubs
                </Tooltip.Trigger>
                <Tooltip.Content
                  className="flex flex-col gap-2"
                  placement="bottom end"
                >
                  {Object.entries(chartData!.chartConfig).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-row items-center gap-1"
                        style={
                          {
                            "--color-bg": value.colorVariable,
                          } as React.CSSProperties
                        }
                      >
                        <div className="size-2.5 shrink-0 rounded-[2px] bg-bg" />
                        <span className="text-xs font-medium">{key}</span>
                      </div>
                    ),
                  )}
                </Tooltip.Content>
              </Tooltip>
            </>
          )}
        </div>
        {isPending ? (
          <SkeletonBarChart className="aspect-video" />
        ) : (
          <DynamicWeeklyHoursCard date={date} />
        )}
      </Card.Content>
    </Card>
  );
}
