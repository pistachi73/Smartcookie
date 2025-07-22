import { cn } from "@/shared/lib/classes";

type HourRowsColumnProps = {
  rows?: number;
};

export const HourRowsColumn = ({ rows = 24 }: HourRowsColumnProps) => {
  return (
    <div className="h-full z-10" aria-hidden="true">
      {Array.from({ length: rows * 2 }, (_, hourIndex) => hourIndex).map(
        (hourIndex) => (
          <div
            key={`hour-${hourIndex}`}
            className={cn(
              "flex h-[calc(var(--row-height,calc(var(--spacing)*12))/2)]",
              hourIndex !== 0 &&
                "after:content-[''] after:z-10 after:w-[calc(100%+var(--spacing)*4)] after:absolute after:-left-2  after:border-b after:border-border/50 even:after:border-border/20",
            )}
          />
        ),
      )}
    </div>
  );
};
