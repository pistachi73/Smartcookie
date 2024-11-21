"use client";

import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft02Icon,
  Calendar02Icon,
  DashboardSquare01Icon,
  Folder02Icon,
  Invoice03Icon,
  UserGroupIcon,
} from "@hugeicons/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="flex flex-col justify-between items-center grow pb-6 rounded-full">
      <Button variant="outline" iconOnly>
        <ArrowLeft02Icon size={18} strokeWidth={1.5} />
      </Button>

      <div className="flex flex-col gap-3 shrink-0 grow-0">
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.includes(href);
          return (
            <Tooltip key={label}>
              <TooltipTrigger>
                <Button
                  key={label}
                  variant={"outline"}
                  iconOnly
                  asChild
                  size={"default"}
                  className={clsx(
                    isActive &&
                      "bg-background-reverse text-responsive-light pointer-events-none",
                  )}
                >
                  <Link href={href}>
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      variant={isActive ? "bulk" : "twotone"}
                      type="rounded"
                    />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={8}
                side="right"
                align="center"
                className="w-fit"
              >
                <p className="text-sm">{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
      <ThemeSwitch />
    </div>
  );
};
