"use client";

import { useMemo } from "react";

import { PieChart } from "@/shared/components/ui/pie-chart";

type ProgressPieChartProps = {
  completedSessions: number;
  totalSessions: number;
};

export const ProgressPieChart = ({
  completedSessions,
  totalSessions,
}: ProgressPieChartProps) => {
  const data = useMemo(
    () => [
      { name: "Completed", value: completedSessions },
      { name: "Remaining", value: totalSessions - completedSessions },
    ],
    [completedSessions, totalSessions],
  );

  const valueFormatter = () => {
    const percentage =
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;

    return `${percentage}%`;
  };

  return (
    <PieChart
      className="mx-auto"
      data={data}
      dataKey="value"
      nameKey="name"
      variant="donut"
      colors={["var(--primary)", "var(--primary-tint)"]}
      showLabel
      label=""
      valueFormatter={() => ""}
      pieProps={{
        outerRadius: "65%",
      }}
      config={{
        Completed: { label: "Completed" },
        Remaining: { label: "Remaining" },
      }}
    >
      <text
        x="50%"
        y="47%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-fg font-bold text-3xl"
      >
        {valueFormatter()}
      </text>
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="hanging"
        className="fill-muted-fg text-xs"
      >
        Completed
      </text>
    </PieChart>
  );
};
