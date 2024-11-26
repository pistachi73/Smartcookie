import { cn } from "@/lib/utils";

type CalendarRowsProps = {
  rows?: number;
};

export const CalendarRows = ({ rows = 24 }: CalendarRowsProps) => {
  return (
    <div className="h-full z-10" aria-hidden="true">
      {Array.from({ length: rows }).map((_, hourIndex) => (
        <div
          key={`hour-${hourIndex}`}
          className={cn(
            "flex h-16",
            "after:content-[''] after:z-10 after:w-full after:absolute  after:border-b after:border-border",
          )}
        />
      ))}
    </div>
  );
};
