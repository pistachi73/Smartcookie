import { cn } from "@/lib/utils";
import { Temporal } from "@js-temporal/polyfill";
import { useCurrentTime } from "../use-current-time";

export const HourMarker = ({ date }: { date: Temporal.PlainDate }) => {
  const { top } = useCurrentTime();

  const today = date.equals(Temporal.Now.plainDateISO());

  return (
    <div
      className={cn(
        "h-0.5 absolute w-full z-0 rounded-r-none",
        today
          ? "bg-primary z-20  rounded-r-sm  border-[0.5px] border-l-0 before:transform-3d border-fg/30 before:content-[''] before:right-[calc(100%-2px)] before:h-2 before:top-1/2 before:-translate-y-1/2 before:absolute before:w-0.5 before:rounded-sm before:bg-primary before:border-[0.5px] before:border-fg/30"
          : "bg-primary/50 ",
      )}
      style={{ top: top }}
    >
      {/* <div className="bg-primary border px-1 rounded-xs text-sm font-semibold absolute top-1/2 -translate-y-1/2 right-[calc(100%+var(--spacing)*2)]">
        {format(now, "HH:mm")}
      </div> */}
    </div>
  );
};
