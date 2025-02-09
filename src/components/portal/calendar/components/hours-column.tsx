import { cn } from "@/lib/utils";
import { useCurrentTime } from "../use-current-time";

export const HoursColumn = () => {
  const { top, label } = useCurrentTime();

  return (
    <div className="mr-4 h-auto min-w-12 items-start relative">
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

      <div
        className="text-sm font-medium absolute h-5 right-0 bg-primary/80 px-1 border rounded-xs border-fg/20 flex items-center justify-center"
        style={{ top: `calc(${top}px - (var(--spacing) * 5 / 2) + 1px)` }}
      >
        <p className="text-xs tabular-nums">{label}</p>
      </div>
    </div>
  );
};
