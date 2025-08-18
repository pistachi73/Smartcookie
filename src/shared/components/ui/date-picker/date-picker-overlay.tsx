"use client";

import type { DateDuration } from "@internationalized/date";
import type { DialogProps } from "react-aria-components";

import { cn } from "@/shared/lib/classes";

import { useViewport } from "../../layout/viewport-context/viewport-context";
import { Calendar } from "../calendar";
import { Popover, type PopoverProps } from "../popover";
import { RangeCalendar } from "../range-calendar";

interface DatePickerOverlayProps
  extends Omit<DialogProps, "children" | "className" | "style">,
    Omit<PopoverProps, "children" | "className" | "style"> {
  className?: string | ((values: { defaultClassName?: string }) => string);
  children?: React.ReactNode;
  closeButton?: boolean;
  range?: boolean;
  visibleDuration?: DateDuration;
  pageBehavior?: "visible" | "single";
}

const DatePickerOverlay = ({
  visibleDuration = { months: 1 },
  closeButton = true,
  pageBehavior = "visible",
  range,
  ...props
}: DatePickerOverlayProps) => {
  const { down } = useViewport();
  const isMobile = down("sm");
  return (
    <Popover.Content
      showArrow={false}
      className={cn(
        "flex justify-center p-4 sm:min-w-68 sm:p-2 sm:pt-3",
        visibleDuration?.months === 1 ? "sm:max-w-70" : "sm:max-w-none",
      )}
      {...props}
    >
      {range ? (
        <RangeCalendar
          pageBehavior={pageBehavior}
          visibleDuration={!isMobile ? visibleDuration : undefined}
        />
      ) : (
        <Calendar />
      )}
      {closeButton && (
        <div className="mx-auto flex w-full max-w-[inherit] justify-center py-2.5 sm:hidden">
          <Popover.Close shape="circle" className="w-full">
            Close
          </Popover.Close>
        </div>
      )}
    </Popover.Content>
  );
};

export { DatePickerOverlay };
export type { DatePickerOverlayProps };
