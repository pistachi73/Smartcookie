"use client";

import { createContext, use } from "react";
import type {
  RadioGroupProps as RadioGroupPrimitiveProps,
  RadioProps as RadioPrimitiveProps,
  ValidationResult,
} from "react-aria-components";
import {
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
  composeRenderProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";
import { Description, FieldError, Label } from "./field";

type RadioToggleGroupContextProps = {
  isDisabled?: boolean;
  gap?: 0 | 1 | 2 | 3 | 4;
  appearance?: "plain" | "outline" | "solid";
  orientation?: "horizontal" | "vertical";
  size?: "small" | "medium" | "large" | "square-petite";
};

const RadioToggleGroupContext = createContext<RadioToggleGroupContextProps>({
  gap: 2,
  appearance: "outline",
  orientation: "horizontal",
  size: "medium",
});

type BaseRadioToggleGroupProps = Omit<
  RadioToggleGroupContextProps,
  "gap" | "appearance"
>;
interface RadioToggleGroupPropsNonZeroGap extends BaseRadioToggleGroupProps {
  gap?: Exclude<RadioToggleGroupContextProps["gap"], 0>;
  appearance?: RadioToggleGroupContextProps["appearance"];
}

interface RadioToggleGroupPropsGapZero extends BaseRadioToggleGroupProps {
  gap?: 0;
  appearance?: Exclude<RadioToggleGroupContextProps["appearance"], "plain">;
}

type RadioToggleGroupProps = Omit<
  RadioGroupPrimitiveProps,
  "children" | "className"
> &
  (RadioToggleGroupPropsGapZero | RadioToggleGroupPropsNonZeroGap) & {
    label?: string;
    children?: React.ReactNode;
    description?: string;
    errorMessage?: string | ((validation: ValidationResult) => string);
    ref?: React.Ref<HTMLDivElement>;
    className?: {
      primitive?: string;
      content?: string;
    };
  };

const radioToggleGroupStyles = tv({
  base: "flex",
  variants: {
    orientation: {
      horizontal:
        "flex-row [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      vertical: "flex-col items-start",
    },
    gap: {
      0: "gap-0 rounded-lg *:[label]:inset-ring-1 *:[label]:rounded-none",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    gap: 2,
  },
  compoundVariants: [
    {
      gap: 0,
      orientation: "vertical",
      className:
        "*:[label]:-mt-px *:[label]:first:rounded-t-[calc(var(--radius-lg)-1px)] *:[label]:last:rounded-b-[calc(var(--radius-lg)-1px)]",
    },
    {
      gap: 0,
      orientation: "horizontal",
      className:
        "*:[label]:-mr-px *:[label]:first:rounded-s-[calc(var(--radius-lg)-1px)] *:[label]:last:rounded-e-[calc(var(--radius-lg)-1px)]",
    },
  ],
});

const RadioToggleGroup = ({
  label,
  description,
  errorMessage,
  children,
  ref,
  className,
  appearance = "outline",
  gap = 2,
  size = "medium",
  orientation = "horizontal",
  isRequired,
  ...props
}: RadioToggleGroupProps) => {
  return (
    <RadioToggleGroupContext.Provider
      value={{
        appearance,
        gap,
        orientation,
        size,
        isDisabled: props.isDisabled,
      }}
    >
      <RadioGroupPrimitive
        ref={ref}
        orientation={orientation}
        className={composeRenderProps(
          className?.primitive,
          (className, renderProps) =>
            cn("group flex flex-col gap-2", className),
        )}
        {...props}
      >
        {label && <Label isRequired={isRequired}>{label}</Label>}
        <div
          className={radioToggleGroupStyles({
            gap,
            orientation,
            className: className?.content,
          })}
        >
          {children}
        </div>
        {description && <Description>{description}</Description>}
        <FieldError>{errorMessage}</FieldError>
      </RadioGroupPrimitive>
    </RadioToggleGroupContext.Provider>
  );
};

const radioToggleStyles = tv({
  base: [
    "inset-ring inset-ring-border cursor-pointer items-center gap-x-2 rounded-lg outline-hidden sm:text-sm",
    "forced-colors:[--button-icon:ButtonText] forced-colors:hover:[--button-icon:ButtonText]",
    "*:data-[slot=icon]:-mx-0.5 data-hovered:*:data-[slot=icon]:text-current/90 data-pressed:*:data-[slot=icon]:text-current *:data-[slot=icon]:my-1 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:text-current/60",
  ],
  variants: {
    isDisabled: {
      true: "cursor-default opacity-50 forced-colors:border-[GrayText]",
    },
    isFocused: {
      true: "inset-ring-ring/70 z-20 ring-4 ring-ring/20",
    },
    isSelected: {
      true: "",
    },
    appearance: {
      plain:
        "inset-ring-0 data-selected:bg-secondary data-selected:text-secondary-fg",
      solid: [
        "inset-ring data-selected:inset-ring-fg data-selected:bg-fg data-selected:text-bg",
      ],
      outline: [
        "data-hovered:border-secondary-fg/10 data-pressed:border-secondary-fg/10 data-selected:border-secondary-fg/10 data-hovered:bg-muted data-selected:bg-secondary data-hovered:text-secondary-fg data-selected:text-secondary-fg",
      ],
    },
    noGap: { true: "" },
    orientation: {
      horizontal: "inline-flex justify-center",
      vertical: "flex",
    },
    size: {
      small: "h-9 px-3.5",
      medium: "h-10 px-4",
      large: "h-11 px-5 *:data-[slot=icon]:size-4.5 sm:text-base",
      "square-petite": "size-9 shrink-0",
    },
    shape: {
      square: "rounded-lg",
      circle: "rounded-full",
    },
  },
  defaultVariants: {
    appearance: "outline",
    size: "small",
    shape: "square",
  },
  compoundVariants: [
    {
      noGap: true,
      orientation: "vertical",
      className: "w-full",
    },
  ],
});

interface RadioToggleProps
  extends RadioPrimitiveProps,
    VariantProps<typeof radioToggleStyles> {
  description?: string;
  ref?: React.Ref<HTMLLabelElement>;
}

const RadioToggle = ({
  description,
  ref,
  className,
  appearance,
  ...props
}: RadioToggleProps) => {
  const {
    appearance: groupAppearance,
    orientation,
    gap,
    size,
    isDisabled: isGroupDisabled,
  } = use(RadioToggleGroupContext);

  return (
    <RadioPrimitive
      ref={ref}
      isDisabled={props.isDisabled ?? isGroupDisabled}
      className={composeRenderProps(className, (className, renderProps) =>
        radioToggleStyles({
          isDisabled: renderProps.isDisabled,
          isFocused: renderProps.isFocused,
          isSelected: renderProps.isSelected,
          appearance: appearance ?? groupAppearance,
          size: props.size ?? size,
          orientation,
          shape: props.shape,
          noGap: gap === 0,
          className,
        }),
      )}
      {...props}
    >
      {props.children as React.ReactNode}
      {description && (
        <Description className="block">{description}</Description>
      )}
    </RadioPrimitive>
  );
};

export { RadioToggle, RadioToggleGroup };
export type { RadioToggleGroupProps, RadioToggleProps };
