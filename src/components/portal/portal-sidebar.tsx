"use client";

import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { cn } from "@/lib/utils";
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

import {
  IconChevronLgDown,
  IconCommandRegular,
  IconDashboard,
  IconHeadphones,
  IconLogout,
  IconSettings,
  IconShield,
} from "justd-icons";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Menu,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSectionGroup,
  useSidebar,
} from "ui";

export default function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const state = useSidebar();
  return (
    <Sidebar {...props}>
      <SidebarHeader
        className={cn(
          "flex h-14 flex-row items-center border-b gap-x-2 py-0",
          state.state === "collapsed" && "flex items-center justify-center w-full"
        )}
      >
        <div className='relative h-6 w-3 shrink-0'>
          <Image src='/Logo.svg' alt='SmartCookie' fill className='rounded-full' />
        </div>
        <SidebarLabel className='font-medium'>SmartCookie</SidebarLabel>
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
                    data-slot='icon'
                  />
                  <SidebarLabel>{item.label}</SidebarLabel>
                </SidebarItem>
              );
            })}
          </SidebarSection>
        </SidebarSectionGroup>
      </SidebarContent>

      <SidebarFooter>
        <Menu>
          <Menu.Trigger aria-label='Profile' data-slot='menu-trigger'>
            <Avatar shape='square' src='/images/avatar/cobain.jpg' />
            <div className='text-sm group-data-[collapsible=dock]:hidden'>
              Kurt Cobain
              <span className='-mt-0.5 block text-muted-fg'>kurt@cobain.com</span>
            </div>
            <IconChevronLgDown className='absolute right-3 size-4 transition-transform group-pressed:rotate-180' />
          </Menu.Trigger>
          <Menu.Content placement='bottom right' className='sm:min-w-(--trigger-width)'>
            <Menu.Section>
              <Menu.Header separator>
                <span className='block'>Kurt Cobain</span>
                <span className='font-normal text-muted-fg'>@cobain</span>
              </Menu.Header>
            </Menu.Section>

            <Menu.Item href='#dashboard'>
              <IconDashboard />
              Dashboard
            </Menu.Item>
            <Menu.Item href='#settings'>
              <IconSettings />
              Settings
            </Menu.Item>
            <Menu.Item href='#security'>
              <IconShield />
              Security
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item>
              <IconCommandRegular />
              Command Menu
            </Menu.Item>

            <Menu.Item href='#contact'>
              <IconHeadphones />
              Customer Support
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item href='#logout'>
              <IconLogout />
              Log out
            </Menu.Item>
          </Menu.Content>
        </Menu>
        <ThemeSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare01Icon,
    iconActive: DashboardSquare01IconSolid,
    badge: "New",
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: Calendar03Icon,
    iconActive: Calendar03IconSolid,
  },
  {
    label: "Hubs",
    href: "/hubs",
    icon: Folder02Icon,
    iconActive: Folder02IconSolid,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: UserGroupIcon,
    iconActive: UserGroupIconSolid,
  },
  {
    label: "Quick Notes",
    href: "/quick-notes",
    icon: NoteIcon,
    iconActive: NoteIconSolid,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: Invoice03Icon,
    iconActive: Invoice03IconSolid,
  },
];
