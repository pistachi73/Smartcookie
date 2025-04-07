import { cn } from "@/shared/lib/classes";
import { Badge } from "@/ui/badge";
import { useCurrentTime } from "../../../hooks/use-current-time";

export const HourColumn = () => {
  const { top, label } = useCurrentTime();

  return (
    <div className="shrink-0 h-auto min-w-12 items-start relative ">
      <div className="w-full">
        {Array.from({ length: 24 }).map((_, index) => {
          return (
            <div
              key={`hour-${index}`}
              className={cn(
                "shrink-0 w-16 boder-t border-r border-border/50 pt-2 pl-3 font-medium not-first:border-t",
                "h-[var(--row-height,calc(var(--spacing)*12))]",
                "flex items-start  relative",
              )}
            >
              <span className={cn("text-xs text-text-sub tabular-nums")}>
                {`${String(index).padStart(2, "0")}:00`}
              </span>
            </div>
          );
        })}
      </div>

      <Badge
        intent="primary"
        shape="square"
        className={cn(
          "absolute h-5 left-1.5 tabular-nums",
          "after:content-[''] after:absolute after:inset-x-full after:top-1/2 after:-translate-y-1/2 after:w-6 after:h-0.5 after:bg-primary/50",
        )}
        style={{ top: `calc(${top}px - (var(--spacing) * 5 / 2) + 1px)` }}
      >
        {label}
      </Badge>
    </div>
  );
};
