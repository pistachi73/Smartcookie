"use client";

import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export const NavigationButtons = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-row lg:flex-col gap-5 lg:gap-2 items-start touch-pan-x relative">
      <div className=" absolute bottom-0 left-0 w-[140%] -translate-x-[20%] h-px bg-accent lg:hidden" />
      <Button
        className={cn(
          "hover:bg-transparent lg:hover:bg-accent px-0 rounded-none lg:rounded-md text-sm lg:text-base lg:font-semibold hover:no-underline w-fit lg:w-full flex flex-row gap-2 lg:px-4 justify-start lg:border-b-0  border-b-2",
          pathname === "/account/"
            ? "text-foreground border-b-4 border-secondary font-semibold "
            : "text-foreground/70 hover:text-foreground/50 border-transparent font-normal",
        )}
        variant="ghost"
        size="lg"
        asChild
      >
        <Link href="/account">
          <Home className="w-6 h-6 hidden lg:block" strokeWidth={2} />
          General information
        </Link>
      </Button>
    </div>
  );
};
