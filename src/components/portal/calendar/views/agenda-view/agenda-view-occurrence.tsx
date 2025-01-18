import { Popover } from "@/components/ui/react-aria/popover";
import type { GroupedCalendarOccurrence } from "@/lib/group-overlapping-occurrences";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button, DialogTrigger } from "react-aria-components";
import { EventOccurrenceDialog } from "../../components/event-occurrence-dialog";

export const AgendaViewOccurrence = ({
  occurrence,
}: { occurrence: GroupedCalendarOccurrence }) => {
  return (
    <DialogTrigger>
      <Button
        key={`event-occurrence-${occurrence.eventOccurrenceId}`}
        className={cn(
          "relative h-full w-full border brightness-100 flex items-center rounded-md gap-2 px-1 transition-colors",
          "hover:bg-base-highlight cursor-pointer",
        )}
      >
        <div className="h-[calc(100%-8px)] rounded-lg w-0.5 bg-[#286552] shrink-0 min-w-0 min-h-0 " />
        <div className="text-left flex flex-col gap-0.5 justify-between py-3 pr-2">
          <p className="text-sm line-clamp-2 font-normal leading-tight mb-0.5">
            {occurrence.title}
          </p>
          <span className="text-xs line-clamp-1 text-text-sub">
            {format(occurrence.startTime, "HH:mm")} -{" "}
            {format(occurrence.endTime, "HH:mm")}
          </span>
        </div>
      </Button>
      <Popover placement="bottom" offset={-100} crossOffset={100}>
        <EventOccurrenceDialog occurrence={occurrence} />
      </Popover>
    </DialogTrigger>
  );
};
