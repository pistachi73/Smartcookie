import { twMerge } from "tailwind-merge";

import {
  selectedIndicatorStyles,
  tabListStyles,
  tabPanelStyles,
  tabStyles,
  tabsStyles,
} from "./styles";

interface LoadingTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  defaultSelectedKey?: string;
  children: React.ReactNode;
}

const LoadingTabs = ({
  className,
  orientation = "horizontal",
  defaultSelectedKey,
  children,
  ...props
}: LoadingTabsProps) => {
  return (
    <div
      className={twMerge(
        tabsStyles({
          orientation,
        }),
        className,
      )}
      data-orientation={orientation}
      {...props}
    >
      {children}
    </div>
  );
};

interface LoadingTabListProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const LoadingTabList = ({
  className,
  orientation = "horizontal",
  ...props
}: LoadingTabListProps) => {
  return (
    <div
      className={twMerge(
        tabListStyles({
          orientation,
        }),
        className,
      )}
      data-orientation={orientation}
      role="tablist"
      {...props}
    />
  );
};

interface LoadingTabProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  id: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  children:
    | React.ReactNode
    | ((props: { isSelected: boolean }) => React.ReactNode);
}

const LoadingTab = ({
  children,
  id,
  isSelected = false,
  isDisabled = false,
  className,
  ...props
}: LoadingTabProps) => {
  return (
    <div
      id={id}
      className={twMerge(
        tabStyles({
          isSelected,
          isDisabled,
        }),
        className,
      )}
      role="tab"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      tabIndex={isSelected ? 0 : -1}
      {...props}
    >
      {typeof children === "function" ? children({ isSelected }) : children}
      {isSelected && (
        <span
          data-slot="selected-indicator"
          className={selectedIndicatorStyles}
        />
      )}
    </div>
  );
};

interface LoadingTabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
}

const LoadingTabPanel = ({ className, id, ...props }: LoadingTabPanelProps) => {
  return (
    <div
      id={id}
      className={twMerge(tabPanelStyles, className)}
      role="tabpanel"
      {...props}
    />
  );
};

LoadingTabs.List = LoadingTabList;
LoadingTabs.Tab = LoadingTab;
LoadingTabs.Panel = LoadingTabPanel;

export { LoadingTabs };
export type {
  LoadingTabListProps,
  LoadingTabPanelProps,
  LoadingTabProps,
  LoadingTabsProps,
};
