import { type VariantProps, cva } from "class-variance-authority";
import type { SwitchProps as AriaSwitchProps } from "react-aria-components";
import { Switch as AriaSwitch } from "react-aria-components";
import { cn } from "../../../lib/utils";

type MySwitchProps = Omit<AriaSwitchProps, "children"> & {
  children: React.ReactNode;
};
export const switchVariants = cva(["group flex items-center gap-2"], {
  variants: {
    isDisabled: {
      true: "cursor-not-allowed opacity-60 pointer-events-none",
      false: "",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});
export const Switch = ({
  children,
  className,
  isDisabled,
  ...props
}: MySwitchProps) => {
  return (
    <AriaSwitch
      {...props}
      className={cn(switchVariants({ isDisabled }), className)}
    >
      {children}
    </AriaSwitch>
  );
};

const indicatorVariants = cva([
  "block h-full aspect-square rounded-full bg-overlay transition-all",
  "group-data-[selected]:[transform:translateX(calc(100%-var(--spacing)))]",
  "group-data-[disabled]:bg-border group-data-[disabled]:group-data-[selected]:bg-border",
]);

const indicatorWrapperVariants = cva(
  [
    "bg-overlay-elevated p-px rounded-full relative transition-colors border-1 border-transparent",
    "w-[calc(var(--spacing)*(var(--dimension)*2-2))] h-[calc(var(--spacing)*(var(--dimension)))]",
    "group-data-[hovered]:bg-overlay-elevated-highlight group-data-[selected]:bg-primary",
    "group-data-[focus-visible]:ring-[2px] group-data-[focus-visible]:border-border-highlight group-data-[focus-visible]:ring-elevated-highlight/80",
  ],
  {
    variants: {
      size: {
        xs: "[--dimension:3]",
        sm: "[--dimension:4]",
        default: "[--dimension:5]",
        lg: "[--dimension:6]",
      },
      defaultVariants: {
        size: "sm",
      },
    },
  },
);

type SwitchIndicatorProps = VariantProps<typeof indicatorWrapperVariants> & {
  className?: string;
};

export const SwitchIndicator = ({
  className,
  size = "default",
}: SwitchIndicatorProps) => {
  return (
    <div className={cn(indicatorWrapperVariants({ size }), className)}>
      <div className={indicatorVariants()} />
    </div>
  );
};
