"use client";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex  gap-2 items-center justify-center whitespace-nowrap text-base font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full",
  {
    variants: {
      variant: {
        primary:
          "bg-primary hover:bg-responsive-dark text-light hover:text-responsive-light",
        secondary:
          "bg-responsive-dark text-responsive-light hover:bg-primary hover:text-light",
        tertiary:
          "bg-neutral-500/30 text-responsive-dark hover:bg-responsive-dark hover:text-responsive-light",
        outline: "border border-border bg-background hover:bg-neutral-500/30 ",
        ghost: "hover:bg-responsive-dark hover:text-responsive-light",
        link: "text- underline-offset-2 hover:underline px-0 h-auto",
      },
      size: {
        lg: "h-14 px-6",
        default: "h-12 px-5",
        sm: "h-9 px-4",
      },
      iconOnly: {
        true: "aspect-square p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  iconOnly?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconOnly = false, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            size,
            iconOnly,
            className,
          }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
