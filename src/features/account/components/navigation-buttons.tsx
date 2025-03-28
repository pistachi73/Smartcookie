"use client";

import { cn } from "@/shared/lib/classes";
import { usePathname } from "next/navigation";
import { Link } from "react-aria-components";

import { buttonStyles } from "@/ui/button";
import { Home09Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const NavigationButtons = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-row lg:flex-col gap-5 lg:gap-2 items-start touch-pan-x relative">
      <div className=" absolute bottom-0 left-0 w-[140%] -translate-x-[20%] h-px bg-accent lg:hidden" />

      <Link
        href="/account"
        className={cn(
          buttonStyles({ appearance: "plain", size: "large" }),
          "px-0 text-sm lg:text-md lg:font-medium hover:no-underline w-fit lg:w-full flex flex-row gap-2 lg:px-4 justify-start ",
          pathname === "/account/" ? "text-responsive-dark" : "text-text-sub",
        )}
      >
        <HugeiconsIcon
          icon={Home09Icon}
          size={20}
          className="hidden lg:block"
          strokeWidth={1.5}
        />
        General information
      </Link>
    </div>
  );
};
