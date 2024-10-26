"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";
import { createContext } from "react";
import { useDeviceType } from "../device-only/device-only-provider";

type ResponsiveTooltipTriggerContextType = {
  isMobile?: boolean;
};

export const ResponsiveTooltipTriggerContext =
  createContext<ResponsiveTooltipTriggerContextType>({
    isMobile: false,
  });

const ResponsiveTooltipProvider = TooltipPrimitive.Provider;

const ResponsiveTooltip: React.FC<TooltipPrimitive.TooltipProps> = ({
  children,
  ...props
}) => {
  const { isMobile } = useDeviceType();

  const Root = isMobile ? TooltipPrimitive.Root : TooltipPrimitive.Root;

  const triggerButton = React.Children.map(
    React.Children.map(children, (child) => child)?.[0],
    (child) => child,
  )?.[0];

  const rootChildren = isMobile
    ? triggerButton
      ? triggerButton
      : null
    : children;

  const rootProps = isMobile ? {} : props;
  return (
    <ResponsiveTooltipTriggerContext.Provider value={{ isMobile }}>
      <Root {...rootProps}>{rootChildren}</Root>
    </ResponsiveTooltipTriggerContext.Provider>
  );
};

const ResponsiveTooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ children, ...props }, ref) => {
  const { isMobile } = useDeviceType();

  return (
    <TooltipPrimitive.Trigger ref={ref} {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  );
});

const ResponsiveTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
ResponsiveTooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  ResponsiveTooltip,
  ResponsiveTooltipContent,
  ResponsiveTooltipProvider,
  ResponsiveTooltipTrigger,
};
