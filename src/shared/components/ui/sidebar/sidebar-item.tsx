"use client";

import type { LinkRenderProps } from "react-aria-components";
import { Link, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Badge } from "../badge";
import { Tooltip } from "../tooltip";
import { useSidebar } from "./sidebar-provider";

const sidebarItemStyles = tv({
  base: [
    "font-semibold transition-colors group h-10 relative cursor-pointer overflow-hidden rounded-lg px-3 py-2 text-muted-fg outline-hidden text-sm",
    "border border-transparent",
  ],
  variants: {
    collapsed: {
      false: "flex items-center gap-3",
      true: "flex size-10 items-center justify-center gap-x-0 p-0",
    },
    isActive: {
      true: "bg-muted text-secondary-fg border-muted-fg/30",
    },
    isCurrent: {
      true: "bg-primary-tint/80 border-primary-shade/50 dark:bg-primary-tint/50 text-fg",
    },
  },
});

interface SidebarItemProps
  extends Omit<React.ComponentProps<typeof Link>, "children"> {
  isCurrent?: boolean;
  tooltip?: React.ReactNode | string;
  children?:
    | React.ReactNode
    | ((
        values: LinkRenderProps & {
          defaultChildren: React.ReactNode;
          isCollapsed: boolean;
        },
      ) => React.ReactNode);
  badge?: string | number | undefined;
}

export const SidebarItem = ({
  isCurrent,
  tooltip,
  children,
  badge,
  className,
  ref,
  ...props
}: SidebarItemProps) => {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const link = (
    <Link
      ref={ref}
      data-sidebar-item="true"
      aria-current={isCurrent ? "page" : undefined}
      className={composeRenderProps(className, (cls, renderProps) =>
        sidebarItemStyles({
          ...renderProps,
          isCurrent,
          collapsed: isCollapsed,
          isActive:
            renderProps.isPressed ||
            renderProps.isFocusVisible ||
            renderProps.isHovered,
          className: cls,
        }),
      )}
      {...props}
    >
      {(values) => (
        <>
          {typeof children === "function"
            ? children({ ...values, isCollapsed })
            : children}
          {badge &&
            (state !== "collapsed" ? (
              <Badge
                shape="square"
                intent="primary"
                data-slot="sidebar-badge"
                className="-translate-y-1/2 absolute inset-ring-1 inset-ring-primary/20 inset-y-1/2 right-1.5 h-5.5 w-auto text-[10px] transition-colors group-data-current:inset-ring-transparent"
              >
                {badge}
              </Badge>
            ) : (
              <div
                aria-hidden
                className="absolute top-1 right-1 size-1.5 rounded-full bg-primary"
              />
            ))}
        </>
      )}
    </Link>
  );

  return isCollapsed && tooltip ? (
    <Tooltip delay={0}>
      {link}
      <Tooltip.Content intent="inverse" showArrow={false} placement="right">
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    link
  );
};
