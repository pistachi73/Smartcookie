"use client";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/utils/classes";
import { Home09Icon } from "@hugeicons/react";
import { Link } from "react-aria-components";

export const HomeButton = () => {
  return (
    <Link
      href='/'
      className={cn(
        buttonStyles({
          appearance: "plain",
          size: "square-petite",
          shape: "circle",
          className: "bg-overlay-elevated text-muted-fg hover:text-current",
        })
      )}
    >
      <Home09Icon size={18} strokeWidth={1.5} />
    </Link>
  );
};
