import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import type { ExtendedUser } from "@/types/next-auth";
import { Search01Icon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { ScheduleTracker } from "./schedule-tracker";

export const PortalHeader = async () => {
  const user = (await currentUser()) as ExtendedUser;

  return (
    <div className="flex  w-full  items-center justify-between px-6 py-4">
      <Link href={"/"}>
        <Image src={"/Logo.svg"} alt="Logo" width={24} height={48} />
      </Link>
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
