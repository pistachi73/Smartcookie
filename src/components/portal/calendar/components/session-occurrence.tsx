import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { SessionOccurrence as SessionOccurrenceType } from "@/lib/generate-session-ocurrences";
import { cn } from "@/lib/utils";
import { differenceInMinutes, format } from "date-fns";
import type React from "react";
import { useCalendarContext } from "../calendar-context";
import { SessionOccurrenceDetails } from "./session-occurrence-details";

type SessionOccurrenceProps = {
  occurrence: SessionOccurrenceType;
};

export const SessionOccurrence = ({
  occurrence,
  className,
  ...rest
}: SessionOccurrenceProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { calendarType } = useCalendarContext();
  const top =
    (occurrence.startTime.getHours() + occurrence.startTime.getMinutes() / 60) *
    4;
  const height =
    (differenceInMinutes(occurrence.endTime, occurrence.startTime) / 60) * 4;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full p-0 rounded-2xl"
        align="center"
        side={calendarType === "day" ? "top" : "left"}
      >
        <SessionOccurrenceDetails occurrence={occurrence} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
