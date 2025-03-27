"use client";

import {
  Menu01Icon,
  SidebarLeft01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../button";
import { useSidebar } from "./sidebar-provider";

export const SidebarTrigger = ({
  onPress,
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
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
            data-slot="icon"
            className="hidden md:inline"
          />
          <HugeiconsIcon
            icon={Menu01Icon}
            data-slot="icon"
            className="inline md:hidden"
          />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </Button>
  );
};
