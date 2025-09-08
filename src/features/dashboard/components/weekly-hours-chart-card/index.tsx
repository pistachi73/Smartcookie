"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Card } from "@/shared/components/ui/card";
import { DatePicker } from "@/shared/components/ui/date-picker";
import { Loader } from "@/shared/components/ui/loader";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tooltip } from "@/shared/components/ui/tooltip";

import { useGetWeeklyHours } from "../../hooks/use-get-weekly-hours";

const DynamicWeeklyHoursChart = dynamic(
  () => import("./weekly-hours-chart").then((mod) => mod.WeeklyHoursChart),
  {
    ssr: true,
    loading: () => (
      <div className="aspect-video h-56 sm:h-80 flex items-center justify-center w-full">
        <Loader size="lg" variant="spin" intent="secondary" />
      </div>
    ),
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
    <Card className="@container">
      <Card.Header>
        <Card.Title>Weekly teaching hours</Card.Title>
        <Card.Description className="hidden @2xl:block">
          View your weekly teaching hours and how they are distributed across
          different hubs.
        </Card.Description>
        <Card.Action>
          <DatePicker
            onChange={(value) => value && setDate(value)}
            value={date}
            placement="bottom end"
            className="h-9"
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
                            "--color-bg": value.color,
                          } as React.CSSProperties
                        }
                      >
                        <div className="size-2.5 shrink-0 rounded-[2px] bg-[var(--color-bg)]" />
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
          <div className="aspect-video h-56 sm:h-80 flex items-center justify-center w-full">
            <Loader size="lg" variant="spin" intent="secondary" />
          </div>
        ) : (
          <DynamicWeeklyHoursChart date={date} />
        )}
      </Card.Content>
    </Card>
  );
}
