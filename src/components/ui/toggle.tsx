"use client";

import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

const toggleVariants = cva("", {
  variants: {
    variant: {
      outline: "data-[state=on]:bg-neutral-500/30",
      ghost:
        "hover:bg-neutral-500/30 hover:text-responsive-dark data-[state=on]:bg-responsive-dark  data-[state=on]:text-responsive-light",
    },
  },
  defaultVariants: {
    variant: "ghost",
  },
});

const Toggle = React.forwardRef<
  React.ComponentRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof buttonVariants>
>(({ className, variant, size, iconOnly, ...props }, ref) => {
  if (variant !== "outline" && variant !== "ghost") return null;

  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, className, iconOnly }),
        toggleVariants({ variant }),
      )}
      {...props}
    />
  );
});

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
