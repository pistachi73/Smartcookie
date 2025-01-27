"use client";

import { buttonVariants } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";
import { cn } from "@/lib/utils";
import {
  Calendar02Icon,
  DashboardSquare01Icon,
  Folder02Icon,
  Invoice03Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import { usePathname } from "next/navigation";
import { Link, TooltipTrigger } from "react-aria-components";
import { Tooltip } from "../ui/react-aria/tooltip";

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
    <div className="flex flex-col justify-between items-center p-2 rounded-xl bg-base h-full ">
      <div className="flex flex-col gap-2 shrink-0 grow-0">
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.includes(href);
          return (
            <TooltipTrigger key={label} delay={200} closeDelay={200}>
              <Link
                href={href}
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "default",
                    iconOnly: true,
                  }),
                  "rounded-lg",
                  isActive && "bg-primary text-light pointer-events-none",
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  variant={isActive ? "solid" : "stroke"}
                  type="rounded"
                />
              </Link>
              <Tooltip
                placement="right"
                // sideOffset={4}
                // side="right"
                // align="center"
                // className="w-fit"
              >
                <p className="text-sm">{label}</p>
              </Tooltip>
            </TooltipTrigger>
          );
        })}
      </div>
      <ThemeSwitch />
    </div>
  );
};
