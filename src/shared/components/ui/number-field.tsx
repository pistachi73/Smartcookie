"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  MinusSignIcon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import {
  Button,
  type ButtonProps,
  NumberField as NumberFieldPrimitive,
  type NumberFieldProps as NumberFieldPrimitiveProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { composeTailwindRenderProps } from "@/shared/lib/primitive";
import { cn } from "@/shared/lib/utils";

import { useViewport } from "../layout/viewport-context/viewport-context";
import { Description, FieldError, FieldGroup, Input, Label } from "./field";

const fieldBorderStyles = tv({
  base: "group-focus:border-primary/70 forced-colors:border-[Highlight]",
  variants: {
    isInvalid: {
      true: "group-focus:border-danger/70 forced-colors:border-[Mark]",
    },
    isDisabled: {
      true: "group-focus:border-input/70",
    },
  },
});

interface NumberFieldProps
  extends Omit<NumberFieldPrimitiveProps, "className"> {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  className?: {
    primitive?: string;
    fieldGroup?: string;
    input?: string;
  };
}

const NumberField = ({
  label,
  placeholder,
  description,
  className,
  errorMessage,
  ...props
}: NumberFieldProps) => {
  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <NumberFieldPrimitive
      {...props}
      className={cn(className?.primitive, "group flex flex-col gap-y-1.5")}
    >
      {label && <Label>{label}</Label>}
      <FieldGroup
        className={cn(
          className?.fieldGroup,
          isMobile && [
            "**:[button]:inset-ring **:[button]:inset-ring-fg/5 **:[button]:grid **:[button]:size-8 **:[button]:place-content-center",
            "*:[button]:first:ml-1 *:[button]:last:mr-1",
            "**:[button]:bg-secondary **:[button]:pressed:bg-secondary/80",
          ],
        )}
      >
        {(renderProps) => (
          <>
            {isMobile ? <StepperButton slot="decrement" /> : null}
            <Input
              className={cn(
                className?.input,
                "px-[calc(--spacing(12)-1px)] tabular-nums",
              )}
              placeholder={placeholder}
            />
            {!isMobile ? (
              <div
                className={fieldBorderStyles({
                  ...renderProps,
                  className: "grid place-content-center sm:border-l",
                })}
              >
                <div className="flex h-full flex-col">
                  <StepperButton
                    slot="increment"
                    emblemType="chevron"
                    className="h-4 px-1"
                  />
                  <div
                    className={fieldBorderStyles({
                      ...renderProps,
                      className: "border-input border-b",
                    })}
                  />
                  <StepperButton
                    slot="decrement"
                    emblemType="chevron"
                    className="h-4 px-1"
                  />
                </div>
              </div>
            ) : (
              <StepperButton slot="increment" />
            )}
          </>
        )}
      </FieldGroup>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </NumberFieldPrimitive>
  );
};

interface StepperButtonProps extends ButtonProps {
  slot: "increment" | "decrement";
  emblemType?: "chevron" | "default";
  className?: string;
}

const StepperButton = ({
  slot,
  className,
  emblemType = "default",
  ...props
}: StepperButtonProps) => {
  const icon =
    emblemType === "chevron" ? (
      slot === "increment" ? (
        <HugeiconsIcon icon={ArrowUp01Icon} data-slot="icon" />
      ) : (
        <HugeiconsIcon icon={ArrowDown01Icon} data-slot="icon" />
      )
    ) : slot === "increment" ? (
      <HugeiconsIcon icon={PlusSignIcon} data-slot="icon" />
    ) : (
      <HugeiconsIcon icon={MinusSignIcon} data-slot="icon" />
    );
  return (
    <Button
      className={composeTailwindRenderProps(
        className,
        "relative z-10 h-10 cursor-default pressed:text-primary-fg text-muted-fg group-disabled:bg-secondary/70 sm:pressed:bg-primary forced-colors:group-disabled:text-[GrayText]",
      )}
      slot={slot}
      {...props}
    >
      {icon}
    </Button>
  );
};

export type { NumberFieldProps };
export { NumberField };
