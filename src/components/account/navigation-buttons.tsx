"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Home09Icon } from "@hugeicons/react";

export const NavigationButtons = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-row lg:flex-col gap-5 lg:gap-2 items-start touch-pan-x relative">
      <div className=" absolute bottom-0 left-0 w-[140%] -translate-x-[20%] h-px bg-accent lg:hidden" />
      <Button
        className={cn(
          "px-0 text-sm lg:text-base lg:font-medium hover:no-underline w-fit lg:w-full flex flex-row gap-2 lg:px-4 justify-start ",
          pathname === "/account/"
            ? "text-responsive-dark"
            : "text-neutral-500",
        )}
        variant="ghost"
        size="lg"
        asChild
      >
        <Link href="/account">
          <Home09Icon size={20} className="hidden lg:block" strokeWidth={1.5} />
          General information
        </Link>
      </Button>
      <Button
        className={cn(
          "px-0 text-sm lg:text-base lg:font-medium hover:no-underline w-fit lg:w-full flex flex-row gap-2 lg:px-4 justify-start ",
          pathname === "/test/" ? "text-responsive-dark" : "text-neutral-500",
        )}
        variant="ghost"
        size="lg"
        asChild
      >
        <Link href="/account">
          <Home09Icon size={20} className="hidden lg:block" strokeWidth={1.5} />
          Test
        </Link>
      </Button>
    </div>
  );
};
