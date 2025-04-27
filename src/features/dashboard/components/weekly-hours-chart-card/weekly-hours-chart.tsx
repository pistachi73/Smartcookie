"use client";

import { Chart, ChartTooltip, ChartTooltipContent } from "@/ui/chart";
import { type CalendarDate, getLocalTimeZone } from "@internationalized/date";
import { format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { useGetWeeklyHours } from "../../hooks/use-get-weekly-hours";

type WeeklyHoursChartProps = {
  date: CalendarDate;
};

export function WeeklyHoursCard({ date }: WeeklyHoursChartProps) {
  const { data: chartData } = useGetWeeklyHours(
    date.toDate(getLocalTimeZone()).toISOString(),
  );

  return (
    <Chart config={chartData!.chartConfig} className="aspect-video">
      <BarChart accessibilityLayer data={chartData!.data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          horizontalPoints={[]}
          stroke="var(--color-border)"
        />
        <YAxis
          orientation="right"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}h`}
        />
        <ReferenceLine
          y={chartData?.averageHoursPerDay}
          stroke="var(--color-fg)"
          strokeDasharray="3 3"
          isFront={true}
          label={({ viewBox: { x, y, width } }) => {
            const badgeWidth = 40;
            const badgeHeight = 20;
            const badgeX = x + width + 10;
            const badgeY = y - badgeHeight / 2;

            return (
              <g>
                <rect
                  x={badgeX}
                  y={badgeY}
                  width={badgeWidth}
                  height={badgeHeight}
                  rx={8}
                  fill="var(--color-fg)"
                />
                <text
                  x={badgeX + badgeWidth / 2}
                  y={badgeY + badgeHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--color-bg)"
                  className="text-xs font-medium tabular-nums"
                >
                  AVG
                </text>
              </g>
            );
          }}
        />
        {Object.entries(chartData!.chartConfig).map(([key, value], index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={value?.colorVariable as string}
            stackId="a"
            barSize={40}
          />
        ))}
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => format(value, "MMM d")}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="dot"
              hideLabel
              //   className="w-[180px]"
              formatter={(value, name, item, index) => {
                const total = Object.values(item.payload).reduce(
                  (acc: number, curr) => {
                    if (typeof curr === "number") {
                      return acc + curr;
                    }
                    return acc;
                  },
                  0,
                ) as number;

                return (
                  <>
                    <div
                      className="size-2.5 shrink-0 rounded-[2px] bg-[var(--color-bg)]"
                      style={
                        {
                          "--color-bg": item.color,
                        } as React.CSSProperties
                      }
                    />
                    {name}
                    <div className="ml-auto flex items-baseline gap-0.5 font-medium text-fg tabular-nums">
                      {value}
                      <span className="font-normal text-muted-fg">h</span>
                    </div>
                    {index === Object.keys(item.payload).length - 2 && (
                      <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 font-medium text-foreground text-xs">
                        Total
                        <div className="ml-auto flex items-baseline gap-0.5 font-medium font-mono text-foreground tabular-nums">
                          {total}
                          <span className="font-normal text-muted-fg">h</span>
                        </div>
                      </div>
                    )}
                  </>
                );
              }}
            />
          }
          cursor={false}
          defaultIndex={1}
        />
      </BarChart>
    </Chart>
  );
}
