import { cn } from "@/lib/utils";
import type { DateInputProps as AriaDateInputProps } from "react-aria-components";
import { DateInput as AriaDateInput, DateSegment } from "react-aria-components";

type DateInputProps = Omit<AriaDateInputProps, "children">;

export const DateInput = ({ className, ...props }: DateInputProps) => {
  return (
    <AriaDateInput
      {...props}
      className={cn("flex flex-1 items-center", className)}
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          className={cn(
            "px-px rounded-sm",
            "focus:bg-primary/30",
            "focus:caret-transparent",
            "data-[placeholder]:text-text-sub",
          )}
        />
      )}
    </AriaDateInput>
  );
};
