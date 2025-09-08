import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

export const loaderStyles = tv({
  base: "relative",
  variants: {
    intent: {
      current: "text-current",
      primary: "text-primary",
      secondary: "text-muted-fg",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
    },
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
      xl: "size-10",
    },
  },
  defaultVariants: {
    intent: "current",
    size: "sm",
  },
});

export type LoaderVariantProps = VariantProps<typeof loaderStyles>;


