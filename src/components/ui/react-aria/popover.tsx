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
  "z-50 rounded-lg border overflow-y-auto border-border  bg-gradient-to-b from-elevated-highlight from-80% to-elevated from p-4 shadow-2xl outline-hidden",
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
        DatePicker: "p-3 shadow-md",
        ComboBox: "p-1 shadow-md",
      },
    },
    defaultVariants: {
      trigger: "Select",
    },
  },
);

// className={cn(
//   "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-background shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//   position === "popper" &&
//     "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
//   className,
// )}

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
