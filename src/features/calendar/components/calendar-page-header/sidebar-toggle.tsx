"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SidebarRight01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";

export const SidebarToggle = () => {
  const toggleSidebar = useCalendarStore(
    useShallow((store) => store.toggleSidebar),
  );
  const { up } = useViewport();
  const showSidebarViewport = up("lg");

  if (!showSidebarViewport) {
    return null;
  }

  return (
    <Button
      intent="outline"
      size="sq-md"
      onPress={() => {
        toggleSidebar();
      }}
      aria-label="Toggle sidebar"
    >
      <HugeiconsIcon icon={SidebarRight01Icon} size={16} />
    </Button>
  );
};
