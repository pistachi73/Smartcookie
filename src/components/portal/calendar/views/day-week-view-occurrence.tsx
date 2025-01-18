import {
  type ZonedDateTime,
  getLocalTimeZone,
  parseAbsolute,
} from "@internationalized/date";
import { type HTMLAttributes, useRef } from "react";

import { Popover } from "@/components/ui/react-aria/popover";
import type { EventOccurrence } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { Button, DialogTrigger } from "react-aria-components";
import { useShallow } from "zustand/react/shallow";
import { EventOccurrenceDialog } from "../components/event-occurrence-dialog";

type DayWeekViewOccurrenceProps = {
  occurrence: Partial<EventOccurrence>;
};

export const formatZonedDateTime = (zonedDateTime: ZonedDateTime) =>
  `${String(zonedDateTime.hour).padStart(2, "0")}:${String(zonedDateTime.minute).padStart(2, "0")}`;

const useDayWeekViewOccurrence = () =>
  useCalendarStore(
    useShallow(
      ({ editingEventOccurrenceId, navigateToEditEventOccurrence }) => ({
        editingEventOccurrenceId,
        navigateToEditEventOccurrence,
      }),
    ),
  );

export const DayWeekViewOccurrence = ({
  occurrence,
  className,
  ...rest
}: DayWeekViewOccurrenceProps & HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const { navigateToEditEventOccurrence, editingEventOccurrenceId } =
    useDayWeekViewOccurrence();

  if (!occurrence.startTime || !occurrence.endTime) return null;

  const [parsedStartTime, parsedEndTime] = [
    parseAbsolute(
      occurrence.startTime.toISOString(),
      occurrence.timezone || getLocalTimeZone(),
    ),
    parseAbsolute(
      occurrence.endTime.toISOString(),
      occurrence.timezone || getLocalTimeZone(),
    ),
  ];

  const top = parsedStartTime.hour + parsedStartTime.minute / 60;
  const bottom = parsedEndTime.hour + parsedEndTime.minute / 60;
  const height = bottom - top;

  const isEditing = editingEventOccurrenceId === occurrence.eventOccurrenceId;

  const isShortEvent = height <= 1;

  const startTimeLabel = formatZonedDateTime(parsedStartTime);
  const endTimeLabel = formatZonedDateTime(parsedEndTime);

  return (
    <DialogTrigger>
      <div onDoubleClick={(e) => e.stopPropagation()}>
        <Button
          className={cn("absolute pr-2 pb-0.5 z-10", className)}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   navigateToEditEventOccurrence(occurrence.eventOccurrenceId!);
          // }}

          {...rest}
        >
          <div
            className={cn(
              "h-full w-full bg-[#286552] brightness-60 flex rounded-md gap-2 overflow-hidden",
              "border border-transparent",
              isEditing && "brightness-100 border-responsive-dark/70 ",
              isShortEvent && "items-center",
            )}
          >
            <div className="h-full w-1 bg-responsive-dark/70 shrink-0" />
            <div className={cn("text-left", !isShortEvent && "py-1.5 pr-2")}>
              <p className="line-clamp-2 font-normal leading-tight mb-0.5 text-xs">
                {occurrence.title ? occurrence.title : "Untitled event"}
                {isShortEvent && (
                  <span className="text-text-sub ml-2">{startTimeLabel}</span>
                )}
              </p>
              {!isShortEvent && (
                <span className="line-clamp-1 text-text-sub text-xs">
                  {startTimeLabel} - {endTimeLabel}
                </span>
              )}
            </div>
          </div>
        </Button>
      </div>
      <Popover placement="top">
        <EventOccurrenceDialog occurrence={occurrence} />
      </Popover>
    </DialogTrigger>
  );
};
