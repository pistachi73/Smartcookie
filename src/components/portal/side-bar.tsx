"use client";

import { cn } from "@/lib/utils";
import {
  Calendar02Icon,
  DashboardSquare01Icon,
  Folder02Icon,
  Invoice03Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link, Tooltip, buttonStyles } from "../ui/new/ui";
import { ThemeSwitcher } from "../ui/theme-switcher";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare01Icon,
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: Calendar02Icon,
  },
  {
    label: "Hubs",
    href: "/hubs",
    icon: Folder02Icon,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: UserGroupIcon,
  },
  {
    label: "Billing",
    href: "/billing",
    icon: Invoice03Icon,
  },
];

export const SideBar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between items-center p-2 rounded-xl h-full">
      <div className="flex flex-col gap-2 shrink-0 grow-0">
        <div className="flex items-center justify-center aspect-square relative m-1 mb-4">
          <Image src={"/Logo.svg"} alt="Logo" fill />
        </div>
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.includes(href);
          return (
            <Tooltip key={label} delay={200} closeDelay={200}>
              <Link
                href={href}
                className={(renderProps) =>
                  cn(
                    buttonStyles({
                      ...renderProps,
                      shape: "square",
                      appearance: "plain",
                      size: "square-petite",
                      className: "aspect-square",
                    }),
                  )
                }
              >
                <Icon
                  size={20}
                  variant={isActive ? "solid" : "stroke"}
                  type="rounded"
                  className={cn(
                    isActive
                      ? "text-primary"
                      : "text-muted-fg hover:text-current",
                  )}
                />
              </Link>
              <Tooltip.Content placement="right">
                <p className="text-sm">{label}</p>
              </Tooltip.Content>
            </Tooltip>
          );
        })}
      </div>
      <ThemeSwitcher
        appearance="plain"
        size="square-petite"
        shape="square"
        className={"size-11"}
      />
    </div>
  );
};
