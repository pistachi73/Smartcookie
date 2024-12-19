import { cn } from "@/lib/utils";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/react";
import { useRef } from "react";
import { useLocale, useNumberField } from "react-aria";
import type { NumberFieldProps } from "react-aria-components";
import { useNumberFieldState } from "react-stately";
import { Button } from "./button";
import { type InputProps, inputVariants } from "./input";

const NumberInput = ({
  className,
  inputSize,
  min,
  max,
  ...props
}: InputProps & NumberFieldProps) => {
  const { locale } = useLocale();
  const state = useNumberFieldState({ ...props, locale });
  const inputRef = useRef(null);
  const {
    groupProps: { className: groupClassName, ...groupProps },
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
  } = useNumberField(props, state, inputRef);

  console.log({ incrementButtonProps });

  return (
    <div className={className}>
      <div
        {...groupProps}
        className={cn(
          inputVariants({ inputSize }),
          "tabular-nums relative overflow-hidden",
          "focus-within:ring-[3px]",
          "focus-within:border-neutral-300 focus-within:ring-neutral-300/40",
          "dark:focus-within:border-neutral-500 dark:focus-within:ring-neutral-500/30",
          groupClassName,
        )}
      >
        <input {...inputProps} ref={inputRef} className="max-w-full" />
        <div className="absolute right-0 top-0 h-full flex flex-col">
          <Button
            variant="outline"
            className={cn(
              "h-1/2 w-6 border-0 border-b border-l p-0 rounded-none text-text-sub",
            )}
            type="button"
            isDisabled={!state.canIncrement}
            {...incrementButtonProps}
          >
            <ArrowUp01Icon size={12} />
          </Button>
          <Button
            variant="outline"
            type="button"
            className={cn(
              "h-1/2 w-6  p-0 border-0 border-l rounded-none  text-text-sub",
            )}
            isDisabled={!state.canDecrement}
            {...decrementButtonProps}
          >
            <ArrowDown01Icon size={12} />
          </Button>
        </div>
      </div>
    </div>
    // <NumberField {...props} className={className}>
    //   <Group
    //     className={cn(
    //       inputVariants({ inputSize }),
    //       "tabular-nums relative overflow-hidden",
    //       "focus-within:ring-[3px]",
    //       "focus-within:border-neutral-300 focus-within:ring-neutral-300/40",
    //       "dark:focus-within:border-neutral-500 dark:focus-within:ring-neutral-500/30",
    //     )}
    //   >
    //     <Input className={"max-w-full"} />

    //     <div className="absolute right-0 top-0 h-full flex flex-col">
    //       <Button
    //         type="button"
    //         slot="increment"
    //         className={cn(
    //           buttonVariants({ variant: "outline" }),
    //           "h-1/2 w-6 border-0 border-b border-l p-0 rounded-none text-text-sub",
    //         )}
    //       >
    //         <ArrowUp01Icon size={12} />
    //       </Button>
    //       <Button
    //         slot="decrement"
    //         className={cn(
    //           buttonVariants({ variant: "outline" }),
    //           "h-1/2 w-6  p-0 border-0 border-l rounded-none  text-text-sub",
    //         )}
    //       >
    //         <ArrowDown01Icon size={12} />
    //       </Button>
    //     </div>
    //   </Group>
    // </NumberField>
  );
};

NumberInput.displayName = "NumberInput";

export { NumberInput };
