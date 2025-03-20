import { cn } from "@/shared/lib/classes";

type HourRowsColumnProps = {
  rows?: number;
};

export const HourRowsColumn = ({ rows = 24 }: HourRowsColumnProps) => {
  return (
    <div className="h-full z-10" aria-hidden="true">
      {Array.from({ length: rows }).map((_, hourIndex) => (
        <div
          key={`hour-${hourIndex}`}
          className={cn(
            "flex h-[var(--row-height,calc(var(--spacing)*12))]",
            hourIndex !== 0 &&
              "after:content-[''] after:z-10 after:w-full after:absolute  after:border-b after:border-border/50",
          )}
        />
      ))}
    </div>
  );
};
