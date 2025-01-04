"use client";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from "react-aria-components";

const buttonVariants = cva(
  "cursor-pointer inline-flex  gap-2 items-center justify-center whitespace-nowrap text-text-base font-medium transition-colors  disabled:pointer-events-none disabled:opacity-60 rounded-full",
  {
    variants: {
      variant: {
        primary:
          "focus-ring-primary bg-primary hover:bg-responsive-dark text-light hover:text-responsive-light",
        secondary:
          "focus-ring-dark bg-responsive-dark text-responsive-light hover:bg-primary hover:text-light",
        tertiary:
          "focus-ring-neutral bg-base-highlight text-responsive-dark hover:bg-responsive-dark hover:text-responsive-light",
        outline:
          "focus-ring-neutral border border-border bg-transparent hover:bg-base-highlight",
        ghost:
          "focus-ring-neutral border border-transparent  hover:bg-base-highlight hover:text-responsive-dark",
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

export type ButtonProps = RACButtonProps &
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
  return (
    <RACButton
      className={cn(
        buttonVariants({
          variant,
          size,
          iconOnly,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </RACButton>
  );
};

export { Button, buttonVariants };
