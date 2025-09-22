import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  CalendarSetting02Icon,
} from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

import { useCalendarStore } from "@/features/calendar/providers/calendar-store-provider";

export const ViewSelectorTrigger = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const calendarView = useCalendarStore((store) => store.calendarView);

  return (
    <Button
      size="md"
      intent="outline"
      className={"size-9 p-0! @2xl:px-2.5! @2xl:w-auto @2xl:h-10 text-sm"}
    >
      <HugeiconsIcon
        icon={CalendarSetting02Icon}
        size={18}
        className="block @2xl:hidden"
      />

      <div className="items-center gap-2 hidden @2xl:flex">
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
      </div>
    </Button>
  );
};
