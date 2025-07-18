"use client";
import {
  AccountSetting02Icon,
  DashboardSquare01Icon,
  Invoice02Icon,
  Logout01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { signOut } from "next-auth/react";

import { StudentProfile } from "@/shared/components/students/student-profile";
import type { AuthUser } from "@/types/next-auth";
import { Menu } from "@/ui/menu";
import { UserAvatar } from "@/ui/user-avatar";

export const UserButton = ({ user }: { user: AuthUser }) => {
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
        <Menu.Item href="/portal/account">
          <HugeiconsIcon icon={AccountSetting02Icon} data-slot="icon" />
          Account
        </Menu.Item>
        <Menu.Item href="/portal/account?t=subscription">
          <HugeiconsIcon icon={Invoice02Icon} data-slot="icon" />
          Billing and subscription
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
