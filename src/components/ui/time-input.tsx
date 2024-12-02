import { Clock01Icon } from "@hugeicons/react";
import type { VariantProps } from "class-variance-authority";
import {
  DateInput,
  DateSegment,
  TimeField,
  type TimeFieldProps,
  type TimeValue,
} from "react-aria-components";
import { cn } from "../../lib/utils";
import { inputSizeVariants } from "./input";

type TimeInputPorps<T extends TimeValue> = TimeFieldProps<T> &
  VariantProps<typeof inputSizeVariants>;

export function TimeInput<T extends TimeValue>({
  className,
  inputSize,
  ...props
}: TimeInputPorps<T>) {
  return (
    <TimeField
      className={cn(
        inputSizeVariants({ inputSize }),
        "flex flex-row items-center w-fit justify-between",
        "rounded-lg border",
        " focus-within:ring-[3px]",
        " focus-within:border-neutral-300 focus-within:ring-neutral-300/40",
        " dark:focus-within:border-neutral-500 dark:focus-within:ring-neutral-500/30",
        !props.value && "text-neutral-500",
        className,
      )}
      {...props}
    >
      <DateInput className={cn("flex flex-row items-center")}>
        {(segment) => (
          <DateSegment
            segment={segment}
            className={cn(
              "tabular-nums px-0.5  rounded-sm  ",
              "focus:bg-neutral-200 dark:focus:bg-neutral-700 focus:caret-transparent",
              "data-[placeholder]:text-neutral-500",
            )}
          />
        )}
      </DateInput>
      <Clock01Icon size={18} className={cn("ml-2")} />
    </TimeField>
  );
}
