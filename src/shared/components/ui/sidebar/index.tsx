"use client";

import { cn } from "@/shared/lib/classes";
import dynamic from "next/dynamic";
import type {
  LinkProps,
  LinkRenderProps,
  SeparatorProps as SidebarSeparatorProps,
} from "react-aria-components";
import {
  Header,
  Link,
  Separator,
  Text,
  composeRenderProps,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Badge } from "../badge";
import { Tooltip } from "../tooltip";
import { useSidebar } from "./sidebar-provider";

const DyamicSidebarMobileSheet = dynamic(
  () => import("./sidebar-mobile-sheet"),
  {
    ssr: false,
  },
);

const gap = tv({
  base: [
    "w-(--sidebar-width) group-data-[sidebar-collapsible=hidden]/sidebar-container:w-0",
    "relative h-svh bg-transparent transition-[width] duration-200 ease-linear",
    "group-data-[sidebar-side=right]/sidebar-container:rotate-180",
  ],
  variants: {
    intent: {
      default:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
      fleet:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
      float:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.4))]",
      inset:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2))]",
    },
  },
});

const sidebar = tv({
  base: [
    "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) not-has-data-sidebar-footer:pb-2 transition-[left,right,width] duration-200 ease-linear md:flex",
    "min-h-svh bg-sidebar",
    "**:data-[slot=disclosure]:border-0 **:data-[slot=disclosure]:px-2.5",
  ],
  variants: {
    side: {
      left: "left-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:left-[calc(var(--sidebar-width)*-1)]",
      right:
        "right-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:right-[calc(var(--sidebar-width)*-1)]",
    },
    intent: {
      float: "",
      inset: "",
      fleet: "",
      default: [
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock) group-data-[sidebar-side=left]/sidebar-container:border-(--sidebar-border)",
        "group-data-[sidebar-side=left]/sidebar-container:border-r group-data-[sidebar-side=right]/sidebar-container:border-l",

        "bg-overlay",
      ],
    },
  },
});

interface SidebarProps extends React.ComponentProps<"div"> {
  intent?: "default" | "float" | "inset" | "fleet";
  collapsible?: "hidden" | "dock" | "none";
  side?: "left" | "right";
  closeButton?: boolean;
}

const Sidebar = ({
  closeButton = true,
  collapsible = "hidden",
  side = "left",
  intent = "default",
  className,
  ...props
}: SidebarProps) => {
  const { isMobile, state } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-sidebar-intent={intent}
        data-sidebar-collapsible="none"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col border-r bg-sidebar text-sidebar-fg",
          className,
        )}
        {...props}
      />
    );
  }

  if (isMobile) {
    return (
      <DyamicSidebarMobileSheet
        closeButton={closeButton}
        collapsible={collapsible}
        intent={intent}
        side={side}
        {...props}
      />
    );
  }

  return (
    <div
      data-sidebar-state={state}
      data-sidebar-collapsible={state === "collapsed" ? collapsible : ""}
      data-sidebar-intent={intent}
      data-sidebar-side={side}
      className="group/sidebar-container peer hidden text-sidebar-fg md:block"
      {...props}
    >
      <div aria-hidden="true" className={gap({ intent })} />
      <div
        className={sidebar({
          side,
          intent,
          className,
        })}
        {...props}
      >
        <div
          data-sidebar="default"
          className={twJoin("flex h-full w-full flex-col text-sidebar-fg")}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

const header = tv({
  base: "mb-2 flex flex-col **:data-[slot=sidebar-label-mask]:hidden",
  variants: {
    collapsed: {
      false: "px-4 py-[calc(var(--spacing)*4)]",
    },
  },
});

const SidebarHeader = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"div">) => {
  const { state } = useSidebar();
  return (
    <div
      ref={ref}
      data-sidebar-header="true"
      className={header({ collapsed: state === "collapsed", className })}
      {...props}
    />
  );
};

const footer = tv({
  base: [
    "mt-auto flex flex-col p-2",
    "in-data-[sidebar-intent=fleet]:mt-0 in-data-[sidebar-intent=fleet]:p-0",
    "in-data-[sidebar-intent=fleet]:**:data-[slot=menu-trigger]:rounded-none",
    "**:data-[slot=menu-trigger]:relative **:data-[slot=menu-trigger]:overflow-hidden",
    " **:data-[slot=menu-trigger]:rounded-lg",
    "**:data-[slot=menu-trigger]:flex **:data-[slot=menu-trigger]:cursor-default **:data-[slot=menu-trigger]:items-center **:data-[slot=menu-trigger]:p-2 **:data-[slot=menu-trigger]:outline-hidden sm:**:data-[slot=menu-trigger]:text-sm",
    "**:data-[slot=menu-trigger]:data-hovered:bg-(--sidebar-accent) **:data-[slot=menu-trigger]:data-hovered:text-fg",
  ],
  variants: {
    collapsed: {
      false: [
        "**:data-[slot=avatar]:*:size-8 **:data-[slot=menu-trigger]:**:data-[slot=avatar]:mr-2 **:data-[slot=avatar]:size-8",
        "**:data-[slot=menu-trigger]:**:data-[slot=chevron]:ml-auto **:data-[slot=menu-trigger]:**:data-[slot=chevron]:transition-transform **:data-[slot=menu-trigger]:w-full **:data-[slot=menu-trigger]:data-pressed:**:data-[slot=chevron]:rotate-180",
      ],
      true: [
        "**:data-[slot=chevron]:hidden **:data-[slot=menu-label]:hidden",
        "**:data-[slot=menu-trigger]:grid **:data-[slot=menu-trigger]:size-8 **:data-[slot=menu-trigger]:place-content-center",
      ],
    },
  },
});

const SidebarFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  return (
    <div
      data-sidebar-footer="true"
      className={footer({ collapsed, className })}
      {...props}
    />
  );
};

const SidebarSectionGroup = ({
  className,
  ...props
}: React.ComponentProps<"section">) => {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  return (
    <section
      data-sidebar-section-group="true"
      className={cn(
        "flex w-full flex-col gap-y-6",
        collapsed && "items-center justify-center",
        className,
      )}
      {...props}
    />
  );
};

const SidebarSection = ({
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) => {
  const { state } = useSidebar();
  return (
    <div
      data-sidebar-section="true"
      className={cn(
        "col-span-full flex flex-col gap-y-0.5 in-data-[sidebar-intent=fleet]:px-0 px-2 **:data-sidebar-section:**:gap-y-0 **:data-sidebar-section:pr-0",
        className,
      )}
      {...props}
    >
      {state !== "collapsed" && "title" in props && (
        <Header className="group-data-[sidebar-collapsible=dock]/sidebar-container:-mt-8 mb-1 flex shrink-0 items-center rounded-md px-2.5 font-medium text-sidebar-fg/70 text-xs outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear data-focus-visible:ring-2 *:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 group-data-[sidebar-collapsible=dock]/sidebar-container:opacity-0">
          {props.title}
        </Header>
      )}
      <div className="grid grid-cols-[auto_1fr] gap-y-0.5">
        {props.children}
      </div>
    </div>
  );
};

const sidebarItemStyles = tv({
  base: [
    "font-semibild transition-colors group h-10 relative col-span-full cursor-pointer overflow-hidden rounded-lg px-[calc(var(--spacing)*2.3)] py-[calc(var(--spacing)*1.3)] text-muted-fg outline-hidden sm:text-sm/6",
  ],
  variants: {
    collapsed: {
      false:
        "grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center gap-3 supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
      true: "flex not-has-data-[slot=icon]:hidden size-10 items-center justify-center gap-x-0 p-0 **:data-[slot=menu-trigger]:hidden",
    },
    isActive: {
      true: "bg-muted text-secondary-fg",
    },
    isCurrent: {
      true: "bg-secondary text-secondary-fg",
    },
    isDisabled: {
      true: "cursor-default opacity-50",
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

const SidebarItem = ({
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

const sidebarLink = tv({
  base: "col-span-full items-center focus:outline-hidden",
  variants: {
    collapsed: {
      false:
        "grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
      true: "absolute inset-0 flex size-full justify-center",
    },
  },
});

interface SidebarLinkProps extends LinkProps {
  ref?: React.Ref<HTMLAnchorElement>;
}
const SidebarLink = ({ className, ref, ...props }: SidebarLinkProps) => {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  return (
    <Link
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) =>
        sidebarLink({
          ...renderProps,
          collapsed,
          className,
        }),
      )}
      {...props}
    />
  );
};

const SidebarInset = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"main">) => {
  return (
    <main
      ref={ref}
      className={cn("relative flex h-full w-full overflow-hidden", className)}
      {...props}
    />
  );
};

const SidebarSeparator = ({ className, ...props }: SidebarSeparatorProps) => {
  return (
    <Separator
      orientation="horizontal"
      className={cn(
        "col-span-full mx-auto my-2.5 h-px w-[calc(var(--sidebar-width)-theme(spacing.6))] bg-border",
        className,
      )}
      {...props}
    />
  );
};

const SidebarRail = ({
  className,
  ref,
  ...props
}: React.ComponentProps<"button">) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn(
        "-translate-x-1/2 group-data-[sidebar-side=left]/sidebar-container:-right-4 absolute inset-y-0 z-20 hidden w-4 outline-hidden transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] data-hovered:after:bg-transparent group-data-[sidebar-side=right]/sidebar-container:left-0 sm:flex",
        "in-data-[sidebar-side=left]:cursor-w-resize in-data-[sidebar-side=right]:cursor-e-resize",
        "[[data-sidebar-side=left][data-sidebar-state=collapsed]_&]:cursor-e-resize [[data-sidebar-side=right][data-sidebar-state=collapsed]_&]:cursor-w-resize",
        "group-data-[sidebar-collapsible=hidden]/sidebar-container:translate-x-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:hover:bg-secondary group-data-[sidebar-collapsible=hidden]/sidebar-container:after:left-full",
        "[[data-sidebar-side=left][data-sidebar-collapsible=hidden]_&]:-right-2 [[data-sidebar-side=right][data-sidebar-collapsible=hidden]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
};

type SidebarLabelProps = React.ComponentProps<typeof Text>;

const SidebarLabel = ({ className, ref, ...props }: SidebarLabelProps) => {
  const { state, isMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  if (!collapsed) {
    return (
      <Text
        ref={ref}
        slot="label"
        className={cn(
          "col-start-2 overflow-hidden whitespace-nowrap",
          className,
        )}
        {...props}
      >
        {props.children}
      </Text>
    );
  }
  return null;
};

const nav = tv({
  base: [
    "isolate flex h-[3.2rem] items-center justify-between gap-x-2 px-4 text-navbar-fg sm:justify-start md:w-full",
    "group-has-data-[sidebar-intent=default]/sidebar-root:border-b group-has-data-[sidebar-intent=fleet]/sidebar-root:border-b group-has-data-[sidebar-intent=default]/sidebar-root:bg-overlay",
  ],
  variants: {
    isSticky: {
      true: "static top-0 z-40 group-has-data-[sidebar-intent=default]/sidebar-root:sticky",
    },
  },
});

interface SidebarNavProps extends React.ComponentProps<"nav"> {
  isSticky?: boolean;
}

const SidebarNav = ({
  isSticky = false,
  className,
  ...props
}: SidebarNavProps) => {
  return (
    <nav
      data-slot="sidebar-nav"
      {...props}
      className={nav({ isSticky, className })}
    />
  );
};

export type {
  SidebarItemProps,
  SidebarLabelProps,
  SidebarLinkProps,
  SidebarNavProps,
  SidebarProps,
  SidebarSeparatorProps,
};

export {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarLabel,
  SidebarLink,
  SidebarNav,
  SidebarRail,
  SidebarSection,
  SidebarSectionGroup,
  SidebarSeparator,
  useSidebar,
};
