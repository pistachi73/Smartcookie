import { UserButton } from "@/components/auth/user-button";
import { currentUser } from "@/lib/auth";
import type { ExtendedUser } from "@/types/next-auth";
import { Search01Icon } from "@hugeicons/react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { HomeButton } from "./home-button";

export const PortalHeader = async ({ className }: { className?: string }) => {
  const user = (await currentUser()) as ExtendedUser;

  return (
    <div className={clsx("flex w-full items-center justify-between rounded-lg", className)}>
      <div className='flex items-center justify-center size-12 w-[calc(var(--left-sidebar-width)+var(--panel-gap))'>
        <Link href={"/"}>
          <Image src={"/Logo.svg"} alt='Logo' width={18} height={36} />
        </Link>
      </div>
      <div className='flex items-center gap-2 h-full'>
        <HomeButton />
        <div className='relative h-full'>
          <div className='flex items-center h-full min-w-[300px] rounded-full bg-overlay-elevated px-3 text-sm ring-offset-background'>
            <Search01Icon size={16} strokeWidth={1.5} className='text-muted-fg mr-2' />
            <input
              type='text'
              placeholder='Search...'
              className='flex-1 bg-transparent outline-none placeholder:text-muted-fg'
            />
            <div className='text-xs text-muted-fg'>⌘K</div>
          </div>
        </div>
      </div>
      <div className='flex gap-2 items-center'>
        <UserButton user={user} />
      </div>
    </div>
  );
};
