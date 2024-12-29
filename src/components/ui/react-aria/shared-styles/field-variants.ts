import { type VariantProps, cva } from "class-variance-authority";

export const fieldWrapperVariants = cva(
  [
    "flex rounded-lg w-full border px-3 placeholder:text-text-sub transition-colors",
    "hover:bg-base-highlight",
    "focus-within:bg-base-highlight",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "has-data-[pressed]:bg-base-highlight",
  ],
  {
    variants: {
      size: {
        lg: "h-14 px-6",
        default: "h-12 px-5",
        sm: "h-10 px-3 text-sm placeholder:text-sm",
      },
      isDisabled: {
        true: "cursor-not-allowed opacity-40 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      isDisabled: false,
    },
  },
);

export type FieldWrapperVariants = VariantProps<typeof fieldWrapperVariants>;
