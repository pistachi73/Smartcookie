"use client";

import { cn } from "@/shared/lib/classes";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Calendar03Icon,
  Comment01Icon,
  DashboardSquare01Icon,
  FolderLibraryIcon,
  NoteIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import {
  Calendar03Icon as Calendar03IconSolid,
  Comment01Icon as Comment01IconSolid,
  DashboardSquare01Icon as DashboardSquare01IconSolid,
  FolderLibraryIcon as FolderLibraryIconSolid,
  NoteIcon as NoteIconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from "@hugeicons-pro/core-solid-rounded";

import { UserButton } from "@/features/auth/components/user-button";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarLabel,
  SidebarRail,
  SidebarSectionGroup,
  useSidebar,
} from "@/ui/sidebar/index";
import { SidebarContent } from "@/ui/sidebar/sidebar-content";
import { SidebarItem } from "@/ui/sidebar/sidebar-item";
import { SidebarSection } from "@/ui/sidebar/sidebar-section";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar/sidebar-trigger";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
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
          <SidebarTrigger
            className="size-8"
            intent="plain"
            size="square-petite"
            shape="square"
          />
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

      <SidebarFooter>
        <UserButton />
        {/* <ThemeSwitcher /> */}
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
