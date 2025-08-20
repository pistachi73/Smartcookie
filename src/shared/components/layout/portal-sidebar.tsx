"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon as Calendar03IconSolid,
  Comment01Icon as Comment01IconSolid,
  DashboardSquare01Icon as DashboardSquare01IconSolid,
  Diamond02Icon,
  FolderLibraryIcon as FolderLibraryIconSolid,
  NoteIcon as NoteIconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  AccountSetting02Icon,
  Calendar03Icon,
  Comment01Icon,
  DashboardSquare01Icon,
  FolderLibraryIcon,
  Invoice02Icon,
  Logout01Icon,
  NoteIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarLabel,
  SidebarRail,
  SidebarSectionGroup,
  useSidebar,
} from "@/shared/components/ui/sidebar/index";
import { SidebarContent } from "@/shared/components/ui/sidebar/sidebar-content";
import { SidebarItem } from "@/shared/components/ui/sidebar/sidebar-item";
import { SidebarSection } from "@/shared/components/ui/sidebar/sidebar-section";
import { cn } from "@/shared/lib/classes";

import type { AuthUser } from "@/types/next-auth";
import { ExplorePremiumModal } from "../explore-premium-modal";
import { Button } from "../ui/button";
import { Menu } from "../ui/menu";
import { SidebarTrigger } from "../ui/sidebar/sidebar-trigger";
import { UserAvatar } from "../ui/user-avatar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AuthUser;
};

export default function AppSidebar({ user, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const state = useSidebar();
  return (
    <Sidebar {...props}>
      <SidebarHeader
        className={cn(
          "flex h-14 flex-row items-center justify-between border-b gap-x-2 py-0",
          state.state === "collapsed" &&
            "flex items-center justify-center w-full",
        )}
      >
        <div
          className={cn(
            "w-full flex flex-row items-center sm:justify-start justify-center gap-x-2",
            state.state === "collapsed" && "justify-center",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-full",
              state.state !== "collapsed" && "w-fit",
            )}
          >
            <div className="relative h-8 w-4 shrink-0">
              <Image
                src="/Logo.svg"
                alt="SmartCookie"
                fill
                className="rounded-full"
              />
            </div>
          </div>
          {state.state !== "collapsed" && (
            <SidebarLabel className="font-bold text-lg">
              SmartCookie
            </SidebarLabel>
          )}
        </div>
        {state.state !== "collapsed" && (
          <SidebarTrigger className="size-8" intent="plain" size="sq-sm" />
        )}
      </SidebarHeader>

      <SidebarContent className="mt-4">
        <SidebarSectionGroup>
          <SidebarSection title="Main">
            {navigation.map((item) => {
              const isCurrent = pathname.includes(item.href);
              return (
                <SidebarItem
                  tooltip={item.label}
                  key={item.href}
                  isCurrent={isCurrent}
                  href={item.href}
                  badge={item?.badge}
                  className={cn("group")}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    altIcon={item.iconActive}
                    showAlt={isCurrent}
                    size={18}
                    className={cn(
                      "group-hover:rotate-6 group-hover:scale-105 transition-transform shrink-0",
                      isCurrent && "text-primary",
                    )}
                    data-slot="icon"
                  />
                  <SidebarLabel>{item.label}</SidebarLabel>
                </SidebarItem>
              );
            })}
          </SidebarSection>
          {/* <SidebarSection title="Courses"></SidebarSection> */}
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter
        className={cn(
          state.state === "collapsed" ? "items-center gap-2" : "gap-3",
        )}
      >
        {!user.hasActiveSubscription && (
          <ExplorePremiumModal>
            <Button
              size={state.state === "collapsed" ? "sq-sm" : "md"}
              className={cn(
                "justify-between text-nowrap",
                state.state === "collapsed" && "justify-center",
              )}
            >
              {state.state === "collapsed" ? "" : "Explore premium"}
              <HugeiconsIcon icon={Diamond02Icon} size={16} data-slot="icon" />
            </Button>
          </ExplorePremiumModal>
        )}
        <Menu>
          <Menu.Trigger
            className={cn(
              "flex items-center shrink-0 h-auto",
              state.state === "collapsed" && "justify-center",
            )}
          >
            <UserAvatar userImage={user.image} userName={user.name} size="md" />
            {state.open && (
              <div className="space-y-0.5 text-left">
                <p className="text-sm font-medium">{user.name}</p>
                {user.email && (
                  <p className="text-xs font-normal text-muted-fg line-clamp-1">
                    {user.email}
                  </p>
                )}
              </div>
            )}
          </Menu.Trigger>
          <Menu.Content
            placement="bottom end"
            popover={{ className: "w-full sm:w-(--trigger-width)" }}
          >
            <Menu.Header>
              <p className="text-sm font-medium">{user.name}</p>
              {user.email && (
                <p className="text-xs font-normal text-muted-fg line-clamp-1">
                  {user.email}
                </p>
              )}
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
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

const navigation = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    icon: DashboardSquare01Icon,
    iconActive: DashboardSquare01IconSolid,
    badge: "New",
  },
  {
    label: "Calendar",
    href: "/portal/calendar",
    icon: Calendar03Icon,
    iconActive: Calendar03IconSolid,
  },
  {
    label: "Hubs",
    href: "/portal/hubs",
    icon: FolderLibraryIcon,
    iconActive: FolderLibraryIconSolid,
  },
  {
    label: "Students",
    href: "/portal/students",
    icon: UserGroupIcon,
    iconActive: UserGroupIconSolid,
  },
  {
    label: "Quick Notes",
    href: "/portal/quick-notes",
    icon: NoteIcon,
    iconActive: NoteIconSolid,
  },
  // {
  //   label: "Billing",
  //   href: "/portal/billing",
  //   icon: Invoice03Icon,
  //   iconActive: Invoice03IconSolid,
  // },
  {
    label: "Feedback",
    href: "/portal/feedback",
    icon: Comment01Icon,
    iconActive: Comment01IconSolid,
  },
];
