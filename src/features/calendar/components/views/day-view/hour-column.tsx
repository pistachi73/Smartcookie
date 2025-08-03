import { Badge } from "@/ui/badge";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/classes";

import { useCurrentTime } from "../../../hooks/use-current-time";

export const HourColumn = () => {
  const { top, label } = useCurrentTime();
  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <div className="shrink-0 h-auto  items-start relative ">
      <div className="w-full">
        {Array.from({ length: 24 }, (_, index) => index).map((index) => {
          return (
            <div
              key={`hour-${index}`}
              className={cn(
                "shrink-0 w-10 sm:w-16 boder-t border-r border-border/50 pt-2 pl-3 font-medium not-first:border-t",
                "h-[var(--row-height,calc(var(--spacing)*12))]",
                "flex items-start  relative",
              )}
            >
              <span className={cn("text-xs text-text-sub tabular-nums")}>
                {`${String(index).padStart(2, "0")}${isMobile ? "" : ":00"}`}
              </span>
            </div>
          );
        })}
      </div>
      {!isMobile && (
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
      )}
    </div>
  );
};
