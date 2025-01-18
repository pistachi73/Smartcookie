import { cn } from "@/lib/utils";

export const HoursColumn = () => {
  return (
    <div className="mr-4 h-auto min-w-12 items-start">
      <div className="w-full">
        {Array.from({ length: 24 }).map((_, index) => {
          return (
            <div
              key={`hour-${index}`}
              className={cn(
                "h-[var(--row-height,calc(var(--spacing)*12))]",
                "flex items-center justify-center relative",
              )}
            >
              <span className="text-xs text-text-sub tabular-nums absolute -top-[8px] right-0">
                {index === 0 ? "" : `${String(index).padStart(2, "0")}:00`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
