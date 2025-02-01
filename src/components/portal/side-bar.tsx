"use client";

import { cn } from "@/lib/utils";
import {
  Calendar02Icon,
  DashboardSquare01Icon,
  Folder02Icon,
  Invoice03Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import { usePathname } from "next/navigation";
import { Link, Tooltip, buttonStyles } from "../ui/new/ui";

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
    <div className="flex flex-col justify-between items-center p-2 rounded-xl bg-zinc-900 h-full ">
      <div className="flex flex-col gap-2 shrink-0 grow-0">
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
                      className: "aspect-square size-12",
                    }),
                    isActive && "bg-primary text-light pointer-events-none",
                  )
                }
              >
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  variant={isActive ? "solid" : "stroke"}
                  type="rounded"
                />
              </Link>
              <Tooltip.Content placement="right">
                <p className="text-sm">{label}</p>
              </Tooltip.Content>
            </Tooltip>
          );
        })}
      </div>
      {/* <ThemeSwitcher
        appearance="plain"
        size="square-petite"
        shape="square"
        className={"size-11"}
      /> */}
    </div>
  );
};
