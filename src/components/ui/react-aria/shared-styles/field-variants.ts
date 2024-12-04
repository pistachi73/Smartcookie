import { cva } from "class-variance-authority";

export const fieldWrapperVariants = cva(
  "flex rounded-lg h-10 w-full border bg-background px-3 placeholder:text-neutral-500  disabled:cursor-not-allowed disabled:opacity-50 focus-within:ring-[3px] focus-within:border-neutral-300 focus-within:ring-neutral-300/40 dark:focus-within:border-neutral-500 dark:focus-within:ring-neutral-500/30",
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
