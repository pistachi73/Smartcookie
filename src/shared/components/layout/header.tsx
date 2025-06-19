"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { buttonStyles } from "@/shared/components/ui/button";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { cn } from "@/shared/lib/classes";
import {
  Calendar03Icon as Calendar03IconSolid,
  Comment01Icon as Comment01IconSolid,
  DashboardSquare01Icon as DashboardSquare01IconSolid,
  FolderLibraryIcon as FolderLibraryIconSolid,
  NoteIcon as NoteIconSolid,
  UserGroupIcon as UserGroupIconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import {
  ArrowRight02Icon,
  Calendar03Icon,
  Comment01Icon,
  DashboardSquare01Icon,
  FolderLibraryIcon,
  NoteIcon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Link } from "react-aria-components";

const portalNavigation = [
  {
    label: "Dashboard",
    href: "/portal/dashboard",
    icon: DashboardSquare01Icon,
    iconActive: DashboardSquare01IconSolid,
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
    label: "Feedback",
    href: "/portal/feedback",
    icon: Comment01Icon,
    iconActive: Comment01IconSolid,
  },
];

const publicNavigation = [
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "Who we are",
    href: "/about",
  },
];

export const Header = () => {
  const user = useCurrentUser();
  const pathname = usePathname();

  return (
    <>
      <div aria-hidden="true" className="h-17 bg-bg" />
      <header className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-2 z-50 items-center justify-center">
        <div
          className={cn(
            "bg-overlay rounded-2xl flex shrink-0 items-center  p-1 gap-1",
            "shadow-md border-input",
          )}
        >
          <div className="px-3 flex items-center gap-2 bg-primary-tint h-11 rounded-lg">
            <Image src="/Logo.svg" alt="SmartCookie" height={28} width={14} />
            <p className="text-base font-medium text-primary">SmartCookie</p>
          </div>

          <nav className="flex items-center gap-1">
            {publicNavigation.map((item) => {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={buttonStyles({
                    intent: "plain",
                    size: "large",
                    className:
                      "sm:text-base shrink-0 tracking-tight hover:bg-primary-tint",
                  })}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="h-full  shadow-md border-input bg-overlay rounded-2xl flex gap-1  p-1 items-center shrink-0">
          {user ? (
            <UserButton />
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  buttonStyles({ size: "large", intent: "plain" }),
                  "text-base!  shrink-0 tracking-tight hover:bg-primary-tint",
                )}
              >
                Log in
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonStyles({ size: "large", intent: "primary" }),
                  "group",
                  "sm:text-base  shrink-0 tracking-tight",
                )}
              >
                Start free trial
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={20}
                  className="shrink-0 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </>
          )}
        </div>
      </header>
    </>
  );
};
