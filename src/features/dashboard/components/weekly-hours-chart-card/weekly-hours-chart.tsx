"use client";

import { type CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { BarChart } from "@/shared/components/ui/bar-chart";
import { EmptyState } from "@/shared/components/ui/empty-state";

import { getWeeklyHoursQueryOptions } from "../../hooks/hook-options";

type WeeklyHoursChartProps = {
  date: CalendarDate;
};

interface CustomTooltipProps
  extends Partial<TooltipProps<ValueType, NameType>> {
  active?: boolean;
  payload?: {
    name?: string;
    value?: number;
    dataKey?: string;
    color?: string;
  }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce<number>((acc, curr) => {
    return acc + (curr.value ?? 0);
  }, 0);

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/70 p-3 py-2  text-xs ring ring-secondary backdrop-blur-lg">
      {payload.map((item) => (
        <div key={item.name} className="flex items-center gap-6">
          <p className="flex items-center gap-2">
            <span
              className="block size-2.5 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: item.color,
              }}
            />
            {item.name}
          </p>
          <div className="ml-auto flex items-baseline gap-0.5 font-semibold text-fg tabular-nums">
            {item.value}
            <span className="font-normal text-muted-fg">h</span>
          </div>
        </div>
      ))}
      {payload.length >= 2 && (
        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 font-medium text-foreground text-xs">
          Total
          <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
            {total}
            <span className="font-normal text-muted-fg">h</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function WeeklyHoursCard2({ date }: WeeklyHoursChartProps) {
  const { data: chartData } = useQuery(
    getWeeklyHoursQueryOptions(date.toDate(getLocalTimeZone()).toISOString()),
  );

  if (!chartData?.totalHours)
    return (
      <EmptyState
        className="aspect-video h-56 sm:h-80 flex items-center justify-center text-muted-fg w-full"
        title="No data"
        description="No data available for this week"
      />
    );

  return (
    <BarChart
      className="aspect-video h-56 sm:h-80"
      barProps={{
        type: "basis",
      }}
      data={chartData!.data}
      dataKey="day"
      layout="horizontal"
      barSize={60}
      barRadius={4}
      barGap={2}
      xAxisProps={{
        interval: 0,
      }}
      tooltip={<CustomTooltip />}
      type="stacked"
      legend={false}
      valueFormatter={(value) => `${value}h`}
      config={chartData?.chartConfig ?? {}}
    />
  );
}
