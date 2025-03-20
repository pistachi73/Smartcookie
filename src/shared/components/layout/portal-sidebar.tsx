"use client";

import { ThemeSwitcher } from "@/shared/components/ui/theme-switcher";
import { cn } from "@/shared/lib/classes";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Calendar03Icon,
  DashboardSquare01Icon,
  Folder02Icon,
  Invoice03Icon,
  NoteIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import {
  Calendar03Icon as Calendar03IconSolid,
  DashboardSquare01Icon as DashboardSquare01IconSolid,
  Folder02Icon as Folder02IconSolid,
  Invoice03Icon as Invoice03IconSolid,
  NoteIcon as NoteIconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from "@hugeicons-pro/core-solid-rounded";

import { UserButton } from "@/features/auth/components/user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSectionGroup,
  useSidebar,
} from "@/shared/components/ui";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  const pathname = usePathname();
  const state = useSidebar();
  return (
    <Sidebar {...props}>
      <SidebarHeader
        className={cn(
          "flex h-14 flex-row items-center border-b gap-x-2 py-0",
          state.state === "collapsed" &&
            "flex items-center justify-center w-full",
        )}
      >
        <div className="relative h-6 w-3 shrink-0">
          <Image
            src="/Logo.svg"
            alt="SmartCookie"
            fill
            className="rounded-full"
          />
        </div>
        <SidebarLabel className="font-medium">SmartCookie</SidebarLabel>
      </SidebarHeader>

      <SidebarContent>
        <SidebarSectionGroup>
          <SidebarSection>
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
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserButton />
        <ThemeSwitcher />
      </SidebarFooter>
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
    icon: Folder02Icon,
    iconActive: Folder02IconSolid,
  },
  {
    label: "Clients",
    href: "/portal/clients",
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
