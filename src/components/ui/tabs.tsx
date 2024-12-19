"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const TabsContext = React.createContext<{
  activeTab: string;
}>({
  activeTab: "",
});

const Tabs = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ children, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} {...props}>
    <TabsContext.Provider
      value={{ activeTab: props.value || props.defaultValue || "" }}
    >
      {children}
    </TabsContext.Provider>
  </TabsPrimitive.Root>
));

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-lg border  p-0.5",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, value, ...props }, ref) => {
  const { activeTab } = React.useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "outline-hidden rounded-[6px] h-full relative cursor-pointer inline-flex text-text-sub items-center justify-center whitespace-nowrap  px-3 py-1.5 text-sm font-medium transition-all",
        "disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-hidden",
        !isActive && "hover:bg-neutral-500/30 hover:text-responsive-dark",
        "data-[state=active]:text-responsive-light",
        className,
      )}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      value={value}
      {...props}
    >
      {activeTab === value && (
        <motion.span
          layoutId="bubble"
          className="absolute inset-0 z-10  rounded-[6px] bg-responsive-dark"
          transition={{ type: "spring", bounce: 0.1, duration: 0.6 }}
        />
      )}
      <span className="relative z-20">{children}</span>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
