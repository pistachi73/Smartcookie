"use client";
import { Home, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { ExtendedUser } from "@/types/next-auth";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export const UserButton = ({ user }: { user: ExtendedUser }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          userImage={user?.image}
          userName={user?.name}
          size={"default"}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-[300px] p-2 px-0"
      >
        <DropdownMenuLabel className="mx-2 flex flex-row gap-3 items-center">
          <UserAvatar
            userImage={user?.image}
            userName={user?.name}
            className="h-12 w-12 shrink-0 text-lg"
          />
          <div className="overflow-hidden">
            <p className="text-base font-medium">{user?.name}</p>
            <p className="text-neutral-500 text-sm truncate font-normal">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-border" />
        <DropdownMenuItem
          className="mx-2 flex flex-row gap-2 items-center cursor-pointer text-sm py-2 text-neutral-500"
          asChild
        >
          <Link href="/account">
            <Home className="h-5 w-5" />
            Account
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-border" />

        <LogoutButton asChild>
          <DropdownMenuItem className=" mx-2 flex flex-row gap-2 items-center cursor-pointer text-sm py-2 text-muted-foreground">
            <LogOut className="h-5 w-5" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
