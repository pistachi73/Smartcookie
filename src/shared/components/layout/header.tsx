"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-solid-rounded";
import { Menu01Icon } from "@hugeicons-pro/core-stroke-rounded";
import Image from "next/image";
import { Link } from "react-aria-components";

import { buttonStyles } from "@/shared/components/ui/button";
import { Menu } from "@/shared/components/ui/menu";
import { cn } from "@/shared/lib/classes";

import { env } from "@/env";
import type { AuthUser } from "@/types/next-auth";
import { MaxWidthWrapper } from "./max-width-wrapper";

const publicNavigation = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Highlights",
    href: "#main-points",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "About Us",
    href: "#about",
  },
];

export const Header = ({ user }: { user?: AuthUser }) => {
  const isPortalBlocked = env.NEXT_PUBLIC_BLOCK_PORTAL === "true";
  console.log(user);

  return (
    <>
      <div aria-hidden="true" className="h-17 bg-white" />
      <MaxWidthWrapper
        as="header"
        className="fixed top-[2vw] md:top-4 left-1/2 -translate-x-1/2 flex md:gap-2 z-50 items-center justify-center w-full"
      >
        {/* Desktop Header */}
        <div className="w-full md:flex gap-2 items-center md:justify-center justify-between">
          <div
            className={cn(
              "bg-white rounded-md md:rounded-xl flex shrink-0 items-center md:justify-center justify-between p-1 gap-1",
              "shadow-sm md:shadow-md border-input",
            )}
          >
            <div className="px-3 flex items-center gap-2 md:bg-primary-tint h-11 rounded-lg">
              <Image src="/Logo.svg" alt="SmartCookie" height={28} width={14} />
              <p className="text-base font-medium text-primary">SmartCookie</p>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {publicNavigation.map((item) => {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={buttonStyles({
                      intent: "plain",
                      size: "lg",
                      className: "sm:text-base shrink-0 tracking-tight",
                    })}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <Menu>
              <Menu.Trigger
                className={cn(
                  buttonStyles({ size: "sm", intent: "plain" }),
                  "p-2 md:hidden",
                )}
              >
                <HugeiconsIcon icon={Menu01Icon} size={20} />
              </Menu.Trigger>
              <Menu.Content placement="bottom end" className="min-w-48">
                <Menu.Section>
                  <Menu.Header className="py-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/Logo.svg"
                        alt="SmartCookie"
                        height={28}
                        width={14}
                      />
                      <span className="text-base font-medium text-primary">
                        SmartCookie
                      </span>
                    </div>
                  </Menu.Header>
                  {publicNavigation.map((item) => (
                    <Menu.Item
                      key={item.href}
                      href={item.href}
                      className="py-3"
                    >
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu.Section>

                {/* <Menu.Section>
                  {user ? (
                    <Menu.Item href="/portal/dashboard">
                      <span>Go to dashboard</span>
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={16}
                        className="ml-auto"
                      />
                    </Menu.Item>
                  ) : (
                    <>
                      <Menu.Item href="/login">Log in</Menu.Item>
                      <Menu.Item href="/login">
                        <span>Start free trial</span>
                        <HugeiconsIcon
                          icon={ArrowRight02Icon}
                          size={16}
                          className="ml-auto"
                        />
                      </Menu.Item>
                    </>
                  )}
                </Menu.Section> */}
              </Menu.Content>
            </Menu>
          </div>
          {!isPortalBlocked && (
            <div className="h-full shadow-md bg-overlay rounded-2xl flex gap-1 p-1 items-center shrink-0">
              {user ? (
                <Link
                  href="/portal/dashboard"
                  className={cn(
                    buttonStyles({ size: "lg", intent: "primary" }),
                    "group",
                    "sm:text-base shrink-0 tracking-tight",
                  )}
                >
                  Go to dashboard
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={20}
                    className="shrink-0 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      buttonStyles({ size: "lg", intent: "plain" }),
                      "text-base shrink-0 tracking-tight",
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/login"
                    className={cn(
                      buttonStyles({ size: "lg", intent: "primary" }),
                      "group",
                      "sm:text-base shrink-0 tracking-tight",
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
          )}
        </div>
      </MaxWidthWrapper>
    </>
  );
};
