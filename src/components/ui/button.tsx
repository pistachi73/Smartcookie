"use client";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { type AriaButtonOptions, useButton } from "react-aria";

const buttonVariants = cva(
  "cursor-pointer inline-flex  gap-2 items-center justify-center whitespace-nowrap text-base font-medium transition-colors  disabled:pointer-events-none disabled:opacity-50 rounded-full",
  {
    variants: {
      variant: {
        primary:
          "focus-ring-primary bg-primary hover:bg-responsive-dark text-light hover:text-responsive-light",
        secondary:
          "focus-ring-dark bg-responsive-dark text-responsive-light hover:bg-primary hover:text-light",
        tertiary:
          "focus-ring-neutral bg-neutral-500 text-responsive-dark hover:bg-responsive-dark hover:text-responsive-light",
        outline:
          "focus-ring-neutral border border-border bg-transparent hover:bg-neutral-500/30 ",
        ghost:
          "focus-ring-neutral border border-transparent hover:bg-responsive-dark hover:text-responsive-light",
        destructive:
          "focus-ring-destructive bg-destructive text-responsive-dark hover:bg-responsive-dark hover:text-responsive-light",
        link: "underline-offset-2 hover:underline px-0 h-auto",
      },
      size: {
        lg: "h-14 px-6",
        default: "h-12 px-5",
        sm: "h-10 px-3 text-sm",
        inline: "h-auto px-0 text-sm",
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

type ButtonProps = AriaButtonOptions<"button"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    iconOnly?: boolean;
    children?: React.ReactNode;
  };

const Button = ({
  className,
  variant,
  size,
  iconOnly = false,
  children,
  ...props
}: ButtonProps) => {
  const ref = React.useRef<HTMLButtonElement | null>(null);

  const { buttonProps } = useButton(props, ref);

  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
          iconOnly,
        }),
        className,
      )}
      ref={ref}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export { Button, buttonVariants };
