"use client";

import { Menu02Icon } from "@hugeicons-pro/core-solid-rounded";
import { SidebarLeft01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, type ButtonProps } from "../button";
import { useSidebar } from "./sidebar-provider";

export const SidebarTrigger = ({
  onPress,
  children,
  className,
  ...props
}: ButtonProps) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      aria-label={props["aria-label"] || "Toggle Sidebar"}
      data-sidebar-trigger="true"
      intent={props.intent || "primary"}
      appearance={props.appearance || "plain"}
      size={props.size || "square-petite"}
      onPress={(event) => {
        onPress?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children || (
        <>
          <HugeiconsIcon
            icon={SidebarLeft01Icon}
            size={16}
            className="hidden md:inline"
          />
          <HugeiconsIcon
            icon={Menu02Icon}
            size={20}
            className="inline md:hidden"
          />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </Button>
  );
};
