import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import type React from "react";
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  OverlayArrow,
  composeRenderProps,
} from "react-aria-components";

export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children: React.ReactNode;
}

export const tooltipVariants = cva(
  [
    "group bg-overlay-elevated border border-border-opaque will-change-transform text-sm px-3 py-1 rounded-lg",
  ],
  {
    variants: {
      isDisabled: {
        true: "cursor-not-allowed opacity-60 pointer-events-none",
        false: "",
      },
      isEntering: {
        true: "animate-in fade-in  zoom-in-100  data-[placement='bottom']:slide-in-from-top-1 data-[placement='top']:slide-in-from-bottom-1 data-[placement='left']:slide-in-from-right-1 data-[placement='right']:slide-in-from-left-1 ",
      },
      isExiting: {
        true: "animate-out fade-out zoom-out-95 data-[placement='bottom']:slide-out-to-top-2  data-[placement='top']:slide-out-to-bottom-2 data-[placement='left']:slide-out-to-right-2 data-[placement='right']:slide-out-to-left-2 ",
      },
    },
    defaultVariants: {
      isDisabled: false,
    },
  },
);

export const Tooltip = ({ children, ...props }: TooltipProps) => {
  return (
    <AriaTooltip
      offset={10}
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tooltipVariants({ ...renderProps, className }),
      )}
    >
      <OverlayArrow>
        <svg
          width={12}
          height={12}
          viewBox="0 0 12 12"
          className={cn(
            "fill-elevated stroke-border-opaque",
            "group-data-[placement='bottom']:rotate-180",
            "group-data-[placement='left']:-rotate-90",
            "group-data-[placement='right']:rotate-90",
          )}
        >
          <title>Tooltip Arrow Overlay</title>
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
};
