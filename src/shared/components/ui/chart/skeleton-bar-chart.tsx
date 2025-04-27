"use client";

import { cn } from "@/shared/lib/classes";

interface SkeletonBarChartProps {
  className?: string;
  barCount?: number;
  maxBarWidth?: number;
  gridLineCount?: number;
  xAxisOffset?: number;
  yAxisOffset?: number;
}

export const SkeletonBarChart = ({
  className,
  barCount = 7,
  maxBarWidth = 40,
  gridLineCount = 5,
  xAxisOffset = 10,
  yAxisOffset = 10,
}: SkeletonBarChartProps) => {
  const sideSpacing = 65;
  const topSpacing = 35;
  const availableWidth = `calc(100% - ${sideSpacing}px)`;

  return (
    <div
      className={cn(
        "w-full relative overflow-hidden rounded-lg aspect-video",
        className,
      )}
    >
      <svg
        width="100%"
        height="100%"
        className="relative"
        role="img"
        aria-label="Weekly hours chart loading skeleton"
      >
        <rect
          x={0}
          y={`calc(100% - ${topSpacing}px - 1px)`}
          width={availableWidth}
          height={1}
          className="fill-fg"
        />

        {/* Grid lines */}
        {Array.from({ length: gridLineCount }).map((_, i) => {
          const yPosition = `calc(${((i + 1) * 100) / gridLineCount}% + 1px - ${topSpacing}px)`;

          return (
            <g key={`grid-${i}`}>
              {i !== gridLineCount - 1 && (
                <line
                  x1={0}
                  x2={availableWidth}
                  y1={yPosition}
                  y2={yPosition}
                  stroke="var(--color-border)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              )}

              <rect
                key={`y-label-${i}`}
                x={`calc(${availableWidth} + ${xAxisOffset}px)`}
                y={`calc(${yPosition} - 6px)`}
                width="30px"
                height="12px"
                className="will-change-[opacity] fill-bg dark:fill-overlay-highlight animate-pulse"
                rx={4}
              />
            </g>
          );
        })}

        {/* Data bars with consistent heights for better UX */}
        {Array.from({ length: barCount }).map((_, i) => {
          const barHeight = `${30 + (i % 3) * 20}%`;
          const minSpacing = 2;
          const totalSpacing = `calc(${minSpacing}px * (${barCount} + 1))`;
          const barWidth = `min(${maxBarWidth}px, calc((${availableWidth} - ${totalSpacing}) / ${barCount}))`;
          const barSpacing = `max(${minSpacing}px, calc((${availableWidth} - (${barWidth} * ${barCount})) / ${barCount + 1}))`;
          const xPosition = `calc(${barSpacing} + (${barWidth} + ${barSpacing}) * ${i})`;

          return (
            <g key={`bar-${i}`}>
              <rect
                x={xPosition}
                y={`calc(100% - ${barHeight} - ${topSpacing}px - 1px)`}
                width={barWidth}
                height={barHeight}
                className="will-change-[opacity] fill-bg dark:fill-overlay-highlight animate-pulse"
              />
              <rect
                x={`calc(${xPosition} + calc(${barWidth} / 2) - 15px)`}
                y={`calc(100% - ${topSpacing}px + ${yAxisOffset}px)`}
                width="30px"
                height="12px"
                className="will-change-[opacity] fill-bg dark:fill-overlay-highlight animate-pulse"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
