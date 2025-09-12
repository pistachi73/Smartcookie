import { Temporal } from "temporal-polyfill";

import { cn } from "@/shared/lib/classes";

import { useCurrentTime } from "@/features/calendar/hooks/use-current-time";

export const HourMarker = ({ date }: { date: Temporal.PlainDate }) => {
  const { top } = useCurrentTime();
  const today = date.equals(Temporal.Now.plainDateISO());

  return (
    <div
      className={cn(
        "h-[3px] absolute w-full z-0 rounded-r-none",
        today
          ? "bg-primary z-20  rounded-r-sm  border-[0.5px] border-l-0 before:transform-3d border-fg/30 before:content-[''] before:right-[calc(100%-2px)] before:h-2 before:top-1/2 before:-translate-y-1/2 before:absolute before:size-2 before:rounded-full before:bg-primary before:border-[0.5px] before:border-fg/30"
          : "bg-primary-tint ",
      )}
      style={{ top: top }}
    />
  );
};
