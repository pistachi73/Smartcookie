import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/react-aria/popover";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { EventOccurrence } from "@/db/schema";
import {
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  Clock01Icon,
  MoreVerticalCircle01Icon,
} from "@hugeicons/react";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { Dialog, DialogTrigger, Separator } from "react-aria-components";
import { formatZonedDateTime } from "../views/day-week-view-occurrence";

type EventOccurrenceDialogProps = {
  occurrence: EventOccurrence;
};

export const EventOccurrenceDialog = ({
  occurrence,
}: EventOccurrenceDialogProps) => {
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

  return (
    <Dialog className="space-y-3 w-[300px]">
      <div
        className="flex items-center justify-between"
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-violet-700" />
            <p className="">{occurrence.title}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock01Icon size={16} />

            <div className="text-sm flex items-center gap-1.5">
              <p className=" text-text-sub">
                {formatZonedDateTime(parsedStartTime)}
              </p>
              <ArrowRight02Icon
                color="var(--color-text-sub)"
                size={16}
                variant="solid"
              />
              <p className="text-text-sub">
                {formatZonedDateTime(parsedEndTime)}
              </p>
            </div>
          </div>
        </div>
        <DialogTrigger>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            className="hover:bg-transparent text-text-sub px-0 size-6"
          >
            <MoreVerticalCircle01Icon size={18} />
          </Button>
          <Popover placement="right">
            <div className="w-[300px]">
              <p>Edit</p>
            </div>
          </Popover>
        </DialogTrigger>
      </div>
      <Separator className="bg-border/20" />
      <div>
        <p className="text-sm">{occurrence.description}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm">Participants (2)</p>
        <div className="group  hover:bg-responsive-dark/5 mb-1 flex items-center justify-between gap-2 w-full border rounded-md px-3 py-2 shadow-lg">
          <div className="flex gap-2 items-center">
            <UserAvatar
              userImage={"https://i.pravatar.cc/150?img=1"}
              userName={"Oscar Pulido"}
              size="sm"
              className="size-6"
            />
            <p className="text-sm inline">John Smith</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            className="opacity-0 group-hover:opacity-100 transition-all h-auto text-text-sub px-0 hover:bg-transparent"
          >
            <ArrowUpRight01Icon size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full border rounded-md px-3 py-2 shadow-lg">
          <UserAvatar
            userImage={"https://i.pravatar.cc/150?img=1"}
            userName={"Oscar Pulido"}
            size="sm"
            className="size-6"
          />
          <p className="text-sm">Alberto Smith</p>
        </div>
      </div>
    </Dialog>
  );
};
