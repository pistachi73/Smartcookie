import { Popover } from "@/components/ui/react-aria/popover";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { SessionOccurrence as SessionOccurrenceType } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { parseDateTime } from "@internationalized/date";
import { format } from "date-fns";
import type React from "react";
import { Button, Dialog, DialogTrigger } from "react-aria-components";
import { SessionOccurrenceDetails } from "./session-occurrence-details";

type SessionOccurrenceProps = {
  occurrence: SessionOccurrenceType;
};

export const SessionOccurrence = ({
  occurrence,
  className,
  ...rest
}: SessionOccurrenceProps & React.HTMLAttributes<HTMLDivElement>) => {
  const [parsedStartTime, parsedEndTime] = [
    parseDateTime(occurrence.startTime),
    parseDateTime(occurrence.endTime),
  ];

  const top = (parsedStartTime.hour + parsedStartTime.minute / 60) * 4;
  const bottom = (parsedEndTime.hour + parsedEndTime.minute / 60) * 4;
  const height = bottom - top;

  return (
    <DialogTrigger>
      <Button
        className={cn("absolute", className)}
        style={{
          top: `${top}rem`,
          height: `${height}rem`,
          ...rest.style,
        }}
      >
        <div className="h-full w-full bg-[#1C7357] rounded-lg p-[6px] flex flex-row gap-3 overflow-hidden">
          <div className="h-full w-1 rounded-full bg-[#30EEAC] shrink-0" />
          <div className=" flex flex-col justify-between py-0.5">
            <div className="text-left text-sm text-responsive-dark">
              <p className="line-clamp-1 font-medium">{occurrence.title}</p>
              <span className="line-clamp-1 opacity-60">
                {format(occurrence.startTime, "HH:mm")} -{" "}
                {format(occurrence.endTime, "HH:mm")}
              </span>
            </div>
            <div className="flex items-center">
              <UserAvatar
                size="sm"
                className="not-first:-ml-2 size-7"
                userImage={"https://i.pravatar.cc/150?img=3"}
              />
              <UserAvatar
                userImage={"https://i.pravatar.cc/150?img=1"}
                size="sm"
                className="not-first:-ml-2 size-7"
              />
            </div>
          </div>
        </div>
      </Button>
      <Popover placement="right" className={"p-0 overflow-hidden"}>
        <Dialog>
          <SessionOccurrenceDetails occurrence={occurrence} />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
