"use client";

import { cn } from "@/shared/lib/classes";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Calendar03Icon,
  DashboardSquare01Icon,
  FolderLibraryIcon,
  Invoice03Icon,
  NoteIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import {
  Calendar03Icon as Calendar03IconSolid,
  DashboardSquare01Icon as DashboardSquare01IconSolid,
  FolderLibraryIcon as FolderLibraryIconSolid,
  Invoice03Icon as Invoice03IconSolid,
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
import { ThemeSwitcher } from "../ui/theme-switcher";

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
        <div className="w-full flex flex-row items-center sm:justify-start justify-center gap-x-2">
          <div className="relative h-8 w-4 shrink-0">
            <Image
              src="/Logo.svg"
              alt="SmartCookie"
              fill
              className="rounded-full"
            />
          </div>
          <SidebarLabel className="font-bold text-lg">SmartCookie</SidebarLabel>
        </div>
        {state.state !== "collapsed" && (
          <SidebarTrigger
            className="size-8"
            appearance="plain"
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
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    altIcon={item.iconActive}
                    showAlt={isCurrent}
                    size={18}
                    className={cn(isCurrent && "text-primary")}
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
        <ThemeSwitcher />
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
  {
    label: "Billing",
    href: "/portal/billing",
    icon: Invoice03Icon,
    iconActive: Invoice03IconSolid,
  },
];
