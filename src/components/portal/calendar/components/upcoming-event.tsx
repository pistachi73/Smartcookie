import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { ArrowUpRight01Icon } from "@hugeicons/react";

type UpcomingEventProps = {
  hubName: string;
};

export const UpcomingEvent = ({ hubName }: UpcomingEventProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-row not-first:ml-2 ">
          <UserAvatar
            size="sm"
            className="not-first:-ml-2"
            userImage={"https://i.pravatar.cc/150?img=3"}
          />
          <UserAvatar
            size="sm"
            className="not-first:-ml-2"
            userImage={"https://i.pravatar.cc/150?img=8"}
          />
        </div>
        <p className="font-medium">English A1 - Dani</p>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-sub text-sm">Upcoming event</p>
          <p className="text-sm">Today from 3PM - 4PM</p>
        </div>
        <Button variant="tertiary" size="sm" iconOnly>
          <ArrowUpRight01Icon />
        </Button>
      </div>
    </div>
  );
};
