"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/shared/components/ui/button";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";

export const NavigationButtons = () => {
  const onNavigation = useCalendarStore(
    useShallow((store) => store.onNavigation),
  );

  return (
    <div className="flex items-center">
      <Button
        intent="plain"
        size="square-petite"
        className="size-9 sm:size-10 p-0 sm:text-muted-fg hover:text-current"
        onPress={() => {
          onNavigation(-1);
        }}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
      </Button>
      <Button
        intent="plain"
        size="square-petite"
        className="size-9 sm:size-10 p-0 sm:text-muted-fg hover:text-current"
        onPress={() => {
          onNavigation(1);
        }}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
      </Button>
    </div>
  );
};
