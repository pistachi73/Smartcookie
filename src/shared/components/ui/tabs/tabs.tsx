"use client";

import { LayoutGroup, motion } from "motion/react";
import { useId } from "react";
import type {
  TabListProps as TabListPrimitiveProps,
  TabPanelProps as TabPanelPrimitiveProps,
  TabProps as TabPrimitiveProps,
  TabsProps as TabsPrimitiveProps,
} from "react-aria-components";
import {
  composeRenderProps,
  TabList as TabListPrimitive,
  TabPanel as TabPanelPrimitive,
  Tab as TabPrimitive,
  Tabs as TabsPrimitive,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { composeTailwindRenderProps } from "../primitive";
import {
  selectedIndicatorStyles,
  tabListStyles,
  tabPanelStyles,
  tabStyles,
  tabsStyles,
} from "./styles";

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

interface TabListProps<T extends object> extends TabListPrimitiveProps<T> {
  ref?: React.RefObject<HTMLDivElement>;
}
const TabList = <T extends object>({
  className,
  ref,
  ...props
}: TabListProps<T>) => {
  const id = useId();
  return (
    <LayoutGroup id={id}>
      <TabListPrimitive
        ref={ref}
        {...props}
        className={composeRenderProps(className, (className, renderProps) =>
          tabListStyles({ ...renderProps, className }),
        )}
      />
    </LayoutGroup>
  );
};

interface TabProps extends TabPrimitiveProps {
  ref?: React.RefObject<HTMLDivElement>;
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
            <motion.span
              data-slot="selected-indicator"
              className={selectedIndicatorStyles}
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
const TabPanel = ({ className, ref, ...props }: TabPanelProps) => {
  return (
    <TabPanelPrimitive
      {...props}
      ref={ref}
      className={composeTailwindRenderProps(className, tabPanelStyles)}
    />
  );
};

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export { Tabs };
export type { TabListProps, TabPanelProps, TabProps, TabsProps };
