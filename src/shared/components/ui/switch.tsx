"use client";

import {
  Switch as SwitchPrimitive,
  type SwitchProps as SwitchPrimitiveProps,
} from "react-aria-components";

import { cn } from "@/shared/lib/classes";
import { tv } from "tailwind-variants";
import { composeTailwindRenderProps } from "./primitive";

const switchVariants = tv({
  base: "group inline-flex touch-none items-center sm:text-sm",

  variants: {
    size: {
      small: "[--dimension:4]",
      medium: "[--dimension:5]",
      large: "[--dimension:6]",
    },
  },

  defaultVariants: {
    size: "medium",
  },
});

interface SwitchProps extends SwitchPrimitiveProps {
  ref?: React.RefObject<HTMLLabelElement>;
  size?: "small" | "medium" | "large";
}
const Switch = ({ children, className, size, ref, ...props }: SwitchProps) => {
  return (
    <SwitchPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(
        className,
        switchVariants({ size }),
      )}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {(values) => (
        <>
          <span
            className={cn(
              "mr-2 cursor-pointer rounded-full border-2 border-transparent bg-(--switch) transition duration-200 [--switch:color-mix(in_oklab,var(--color-muted)_90%,black_10%)] group-data-disabled:cursor-default group-data-selected:bg-primary group-data-disabled:opacity-50 group-data-focused:ring-4 group-data-focused:ring-primary/20 group-data-invalid:ring-danger/20 dark:[--switch:color-mix(in_oklab,var(--color-muted)_85%,white_15%)]",
              "h-[calc(var(--spacing)*var(--dimension))] w-[calc(var(--spacing)*(var(--dimension)+3))]",
            )}
          >
            <span
              className={cn(
                "block origin-right rounded-full bg-primary-fg shadow-sm transition-all duration-200 group-data-selected:group-data-[pressed]:ml-2 group-data-selected:ml-3 forced-colors:data-disabled:outline-[GrayText]",
                "size-[calc((var(--dimension)-1)*var(--spacing))] group-data-pressed:w-[calc(var(--spacing)*var(--dimension))]",
              )}
            />
          </span>
          {typeof children === "function" ? children(values) : children}
        </>
      )}
    </SwitchPrimitive>
  );
};

export { Switch };
export type { SwitchProps };
