"use client";
import {
  DashboardSquare01Icon,
  Home09Icon,
  Logout01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { signOut } from "next-auth/react";

import { StudentProfile } from "@/shared/components/students/student-profile";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { Menu } from "@/ui/menu";
import { UserAvatar } from "@/ui/user-avatar";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <Menu>
      <Menu.Trigger>
        <UserAvatar
          userImage={user?.image}
          userName={user?.name}
          size="large"
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom end" popoverClassName="w-[300px]">
        <Menu.Header>
          <StudentProfile
            name={user?.name}
            image={user?.image ?? null}
            email={user?.email}
            className="w-full"
          />
        </Menu.Header>
        <Menu.Separator />
        <Menu.Item href="/portal/dashboard">
          <HugeiconsIcon icon={DashboardSquare01Icon} data-slot="icon" />
          Dashboard
        </Menu.Item>
        <Menu.Item href="/account">
          <HugeiconsIcon icon={Home09Icon} data-slot="icon" />
          Account
        </Menu.Item>
        <Menu.Separator />
        <Menu.Item onAction={() => signOut({ redirectTo: "/" })}>
          <HugeiconsIcon icon={Logout01Icon} data-slot="icon" />
          Logout
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
};
