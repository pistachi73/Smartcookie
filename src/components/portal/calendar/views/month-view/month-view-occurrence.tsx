import type { EventOccurrence } from "@/db/schema";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const MonthViewOccurrence = ({
  occurrence,
  className,
}: {
  occurrence: EventOccurrence;
  className?: string;
}) => {
  const today = new Date();

  return (
    <div
      className={cn(
        "text-xs min-w-0 w-full h-6 p-0.5 px-1 rounded-md text-text-base hover:bg-base-highlight flex gap-1 items-center transition-colors cursor-pointer",
        className,
      )}
    >
      <div className="size-1 bg-lime-300 rounded-full shrink-0" />
      <p className="text-left text-text-base line-clamp-1">
        <span className="text-text-sub">
          {format(occurrence.startTime, "HH:mm")}
        </span>{" "}
        - {occurrence.title}
      </p>
    </div>
  );
};
