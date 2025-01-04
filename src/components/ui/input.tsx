import * as React from "react";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

export const inputVariants = cva(
  "focus-ring-neutral flex rounded-lg h-10 w-full  border border-border bg-background px-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-sub  disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      inputSize: {
        lg: "h-14 px-6",
        default: "h-12 px-5",
        sm: "h-10 px-3 text-sm placeholder:text-sm",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
);

export const inputSizeVariants = cva("", {
  variants: {
    inputSize: {
      lg: "h-14 px-6",
      default: "h-12 px-5",
      sm: "h-10 px-3 text-sm placeholder:text-sm",
    },
  },
  defaultVariants: {
    inputSize: "default",
  },
});

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({ inputSize, className }),
          className,
          // "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/20",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
