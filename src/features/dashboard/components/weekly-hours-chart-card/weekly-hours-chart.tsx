"use client";

import {
  Chart,
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart";
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

const chartData = Array.from({ length: 12 }, (_, i) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return {
    month: months[i],
    sales: 1000 + Math.floor(Math.random() * 300), // Random value for Sales
    expenses: 800 + Math.floor(Math.random() * 400), // Random value for Expenses
    profit: 200 + Math.floor(Math.random() * 900), // Random value for Profit
  };
});

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-2)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function WeeklyHoursCard({ date }: WeeklyHoursChartProps) {
  const { data: chartData } = useGetWeeklyHours(
    date.toDate(getLocalTimeZone()).toISOString(),
  );

  return (
    // <Chart config={chartConfig} className="w-full">
    //   <BarChart accessibilityLayer data={chartData as any}>
    //     <CartesianGrid vertical={false} />
    //     <XAxis
    //       dataKey="month"
    //       tickLine={false}
    //       tickMargin={10}
    //       axisLine={false}
    //     />
    //     <ChartTooltip
    //       cursor={false}
    //       content={<ChartTooltipContent indicator="dashed" />}
    //     />
    //     <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
    //     <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
    //     <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
    //   </BarChart>
    // </Chart>
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
