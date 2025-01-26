import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type React from "react";
import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";

export type PopoverProps = AriaPopoverProps & {
  children: React.ReactNode;
};

const popoverVariants = cva(
  "z-50! rounded-lg border overflow-y-auto border-border  bg-gradient-to-b from-elevated-highlight from-80% to-elevated from shadow-2xl outline-hidden",
  {
    variants: {
      isEntering: {
        true: "animate-in fade-in  zoom-in-100  data-[placement='bottom']:slide-in-from-top-1 data-[placement='top']:slide-in-from-bottom-1 data-[placement='left']:slide-in-from-right-1 data-[placement='right']:slide-in-from-left-1 ",
      },
      isExiting: {
        true: "animate-out fade-out zoom-out-95 data-[placement='bottom']:slide-out-to-top-2  data-[placement='top']:slide-out-to-bottom-2 data-[placement='left']:slide-out-to-right-2 data-[placement='right']:slide-out-to-left-2 ",
      },
      trigger: {
        Select: "p-1 shadow-md",
        DatePicker: "shadow-md",
        ComboBox: "p-1 shadow-md",
        DialogTrigger: "p-4 shadow-md",
      },
    },
    defaultVariants: {
      trigger: "Select",
    },
  },
);

export function Popover({ children, className, ...props }: PopoverProps) {
  return (
    <AriaPopover
      {...props}
      className={({ isEntering, isExiting, trigger }) =>
        cn(
          popoverVariants({
            isEntering,
            isExiting,
            trigger: trigger as any,
          }),
          className,
        )
      }
    >
      {children}
    </AriaPopover>
  );
}
