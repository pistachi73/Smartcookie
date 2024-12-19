import { cva } from "class-variance-authority";

export const fieldWrapperVariants = cva(
  "flex rounded-lg h-10 w-full border px-3 placeholder:text-text-sub  disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-[4px] focus-within:border-border-highlight focus-within:ring-elevated-highlight/80 hover:bg-base-highlight transition-colors",
  {
    variants: {
      size: {
        lg: "h-14 px-6",
        default: "h-12 px-5",
        sm: "h-10 px-3 text-sm placeholder:text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type FieldWrapperVariants = React.ComponentPropsWithoutRef<
  typeof fieldWrapperVariants
>;
