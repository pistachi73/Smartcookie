import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import type { ExtendedUser } from "@/types/next-auth";
import { Search01Icon } from "@hugeicons/react";
import { ScheduleTracker } from "./schedule-tracker";

export const PortalHeader = async () => {
  const user = (await currentUser()) as ExtendedUser;

  return (
    <div className="flex  w-full  items-center justify-between py-4">
      <ScheduleTracker />
      <div className="flex gap-2 items-center">
        <Button iconOnly variant="ghost">
          <Search01Icon size={18} strokeWidth={2} />
        </Button>
        <UserButton user={user} />
      </div>
    </div>
  );
};
