"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CalendarAdd02Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

import { HubPanelHeader } from "../hub-panel-header";
import { SessionSkeleton } from "./session-skeleton";

export const HubSessionsLoading = () => {
  return (
    <div className="min-h-0">
      <HubPanelHeader
        title="Sessions timeline"
        actions={
          <Button intent={"primary"} className={"w-full sm:w-fit"} size="sm">
            <HugeiconsIcon
              icon={CalendarAdd02Icon}
              size={16}
              data-slot="icon"
            />
            <p>Add session</p>
          </Button>
        }
      />

      {Array.from({ length: 5 }).map((_, index) => (
        <SessionSkeleton key={`session-skeleton-${index}`} />
      ))}
    </div>
  );
};
