import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  CalendarSetting02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { cn } from "@/shared/lib/utils";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";

export const ViewSelectorTrigger = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const calendarView = useCalendarStore((store) => store.calendarView);

  const { down } = useViewport();
  const isMobile = down("sm");
  return (
    <Button
      size={isMobile ? "sq-md" : "md"}
      intent={isMobile ? "plain" : "outline"}
      className={cn(isMobile && "size-9")}
    >
      {isMobile ? (
        <HugeiconsIcon icon={CalendarSetting02Icon} size={18} />
      ) : (
        <>
          {children ? (
            children
          ) : (
            <span className="capitalize">{calendarView}</span>
          )}

          <HugeiconsIcon
            icon={ArrowDown01Icon}
            aria-hidden
            data-slot="icon"
            className="size-4 shrink-0 text-muted-fg duration-300 group-data-open:rotate-180 group-data-open:text-fg"
          />
        </>
      )}
    </Button>
  );
};
