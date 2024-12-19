import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import type { ExtendedUser } from "@/types/next-auth";
import { Search01Icon } from "@hugeicons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ScheduleTracker } from "./schedule-tracker";

export const PortalHeader = async ({ className }: { className?: string }) => {
  const user = (await currentUser()) as ExtendedUser;

  return (
    <div
      className={clsx(
        "flex  w-full  items-center justify-between h-16",
        className,
      )}
    >
      <div className="flex items-center justify-center size-12 w-16">
        <Link href={"/"}>
          <Image src={"/Logo.svg"} alt="Logo" width={24} height={48} />
        </Link>
      </div>
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
