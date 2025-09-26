"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons-pro/core-solid-rounded";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "react-aria-components";

import { buttonStyles } from "@/shared/components/ui/button";
import { Link } from "@/shared/components/ui/link";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/classes";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { AuthUser } from "@/types/next-auth";
import { HeaderMobileSheetTrigger } from "./header-mobile-sheet/header-mobile-sheet-trigger";

export const buttonCustomStyles =
  "relative sm:text-base shrink-0 tracking-tight hover:bg-secondary pressed:bg-secondary/80 cursor-pointer transition-colors";

const DynamicMobileSheet = dynamic(
  () => import("./header-mobile-sheet").then((mod) => mod.MobileSheet),
  {
    loading: () => <HeaderMobileSheetTrigger />,
  },
);

export const useNavigationLinks = () => {
  const t = useTranslations("Landing.Navigation");
  return [
    { id: "features", label: t("features"), href: "/#features" },
    { id: "highlights", label: t("highlights"), href: "/#highlights" },
    { id: "pricing", label: t("pricing"), href: "/#pricing" },
    { id: "about", label: t("about"), href: "/#about" },
  ];
};

export const useHandleNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (id: string, href: string) => {
    const isLandingPage = pathname === "/";

    if (isLandingPage) {
      const element = document.querySelector(`#${id}`);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      router.push(href);
    }
  };
};

export const Header = ({
  user,
}: {
  user?: AuthUser;
  portalEnabled?: boolean;
}) => {
  const { down } = useViewport();
  const handleNavigation = useHandleNavigation();
  const navigationLinks = useNavigationLinks();

  return (
    <>
      <div aria-hidden="true" className="h-17 bg-white" />
      <MaxWidthWrapper
        as="header"
        className="fixed top-[2vw] md:top-4 left-1/2 -translate-x-1/2 flex md:gap-2 z-50 items-center justify-center w-full"
      >
        <div className="w-full flex gap-2 bg-[color-mix(in_oklab,var(--color-secondary)_60%,white_80%)] rounded-2xl shadow-lg p-1 relative justify-between items-center backdrop-blur-2xl border border-border/20 ">
          <div className="px-2 flex items-center gap-2">
            <Image
              src="/logos/smartcookie_logo.svg"
              alt="SmartCookie"
              height={36}
              width={18}
            />
          </div>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navigationLinks.map((item) => {
              return (
                <Button
                  key={item.id}
                  onPress={() => handleNavigation(item.id, item.href)}
                  className={buttonStyles({
                    intent: "plain",

                    className: buttonCustomStyles,
                  })}
                >
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <Link
                href="/portal/dashboard"
                className={cn(
                  buttonStyles({ size: "lg", intent: "secondary" }),
                  "group",
                  buttonCustomStyles,
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
                    buttonCustomStyles,
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className={cn(
                    buttonStyles({ size: "lg", intent: "secondary" }),
                    "group sm:text-base",
                    buttonCustomStyles,
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

          {down("lg") && (
            <div className="flex items-center gap-1">
              {!user && (
                <Link
                  href="/login"
                  className={cn(
                    buttonStyles({ size: "lg", intent: "plain" }),
                    buttonCustomStyles,
                    "text-base sm:text-base underline",
                  )}
                >
                  Start free trial
                </Link>
              )}
              <DynamicMobileSheet />
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </>
  );
};
