"use client";

import { useId } from "react";

import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import type {
  TabListProps as TabListPrimitiveProps,
  TabPanelProps as TabPanelPrimitiveProps,
  TabProps as TabPrimitiveProps,
  TabsProps as TabsPrimitiveProps,
} from "react-aria-components";
import {
  TabList,
  TabPanel,
  Tab as TabPrimitive,
  Tabs as TabsPrimitive,
  composeRenderProps,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";
import { composeTailwindRenderProps } from "./primitive";

const tabsStyles = tv({
  base: "group/tabs flex gap-4 forced-color-adjust-none",
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "w-[800px] flex-row",
    },
  },
});

interface TabsProps extends TabsPrimitiveProps {
  ref?: React.RefObject<HTMLDivElement>;
}
const Tabs = ({ className, ref, ...props }: TabsProps) => {
  return (
    <TabsPrimitive
      className={composeRenderProps(className, (className, renderProps) =>
        tabsStyles({
          ...renderProps,
          className,
        }),
      )}
      ref={ref}
      {...props}
    />
  );
};

const tabListStyles = tv({
  base: "flex forced-color-adjust-none",
  variants: {
    orientation: {
      horizontal: "flex-row gap-x-2 w-fit p-1 rounded-lg bg-overlay-highlight",
      vertical: "flex-col items-start gap-y-4 border-l",
    },
  },
});

interface TabListProps<T extends object> extends TabListPrimitiveProps<T> {
  ref?: React.RefObject<HTMLDivElement>;
}
const List = <T extends object>({
  className,
  ref,
  ...props
}: TabListProps<T>) => {
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <TabList
        ref={ref}
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
          tabListStyles({ ...renderProps, className }),
        )}
      />
    </LayoutGroup>
  );
};

const tabStyles = tv({
  base: [
    "relative flex cursor-default items-center whitespace-nowrap rounded-full font-medium text-sm outline-hidden transition data-hovered:text-fg *:data-[slot=icon]:mr-2 *:data-[slot=icon]:size-4",
    "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:py-0 group-data-[orientation=vertical]/tabs:pr-2 group-data-[orientation=vertical]/tabs:pl-4",
    "group-data-[orientation=horizontal]/tabs:p-2 group-data-[orientation=horizontal]/tabs:px-3",
  ],
  variants: {
    isSelected: {
      false: "text-muted-fg",
      true: "text-fg",
    },
    isFocused: { false: "ring-0", true: "text-fg" },
    isDisabled: {
      true: "text-muted-fg/50",
    },
  },
});

interface TabProps extends TabPrimitiveProps {
  ref?: React.RefObject<HTMLButtonElement>;
  children:
    | React.ReactNode
    | ((props: { isSelected: boolean }) => React.ReactNode);
}
const Tab = ({ children, ref, ...props }: TabProps) => {
  return (
    <TabPrimitive
      ref={ref}
      {...props}
      className={composeRenderProps(
        props.className,
        (_className, renderProps) =>
          tabStyles({
            ...renderProps,
            className: twJoin("href" in props && "cursor-pointer", _className),
          }),
      )}
    >
      {({ isSelected }) => (
        <>
          {typeof children === "function" ? children({ isSelected }) : children}
          {isSelected && (
            <m.span
              className={cn(
                "rounded bg-accent w-full",
                // horizontal
                "group-data-[orientation=horizontal]/tabs:absolute group-data-[orientation=horizontal]/tabs:-z-10 group-data-[orientation=horizontal]/tabs:-translate-1/2 group-data-[orientation=horizontal]/tabs:left-1/2 group-data-[orientation=horizontal]/tabs:inset-y-1/2  group-data-[orientation=horizontal]/tabs:h-full group-data-[orientation=horizontal]/tabs:w-full",
                // vertical
                "group-data-[orientation=vertical]/tabs:left-0 group-data-[orientation=vertical]/tabs:h-[calc(100%-10%)] group-data-[orientation=vertical]/tabs:w-0.5 group-data-[orientation=vertical]/tabs:transform",
              )}
              layoutId="current-selected"
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
            />
          )}
        </>
      )}
    </TabPrimitive>
  );
};

interface TabPanelProps extends TabPanelPrimitiveProps {
  ref?: React.RefObject<HTMLDivElement>;
}
const Panel = ({ className, ref, ...props }: TabPanelProps) => {
  return (
    <TabPanel
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(
        className,
        "flex-1 text-fg text-sm data-focus-visible:outline-hidden",
      )}
    />
  );
};

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;

export { Tabs };
export type { TabListProps, TabPanelProps, TabProps, TabsProps };
