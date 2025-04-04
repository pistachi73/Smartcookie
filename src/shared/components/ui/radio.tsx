"use client";

import type {
  RadioGroupProps as RadioGroupPrimitiveProps,
  RadioProps as RadioPrimitiveProps,
  ValidationResult,
} from "react-aria-components";
import {
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";
import { Description, FieldError, Label } from "./field";
import { composeTailwindRenderProps } from "./primitive";

interface RadioGroupProps
  extends Omit<RadioGroupPrimitiveProps, "children" | "className"> {
  label?: string;
  children?: React.ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  ref?: React.Ref<HTMLDivElement>;
  className?: {
    primitive?: string;
    content?: string;
  };
}

const RadioGroup = ({
  label,
  description,
  errorMessage,
  children,
  ref,
  className,
  ...props
}: RadioGroupProps) => {
  return (
    <RadioGroupPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group flex flex-col gap-2",
      )}
    >
      {label && <Label>{label}</Label>}
      <div
        className={cn(
          "flex select-none gap-2 group-data-[orientation=vertical]:flex-col group-data-[orientation=horizontal]:flex-wrap group-data-[orientation=horizontal]:gap-2 sm:group-data-[orientation=horizontal]:gap-4",
          className?.content,
        )}
      >
        {children}
      </div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </RadioGroupPrimitive>
  );
};

const radioStyles = tv({
  base: "size-4 shrink-0 rounded-full border bg-muted transition",
  variants: {
    isSelected: {
      false: "border-input",
      true: "border-[4.5px] border-primary",
    },
    isFocused: {
      true: [
        "border-ring bg-primary/20 ring-4 ring-primary/20",
        "group-data-invalid:border-danger/70 group-data-invalid:bg-danger/20 group-data-invalid:ring-danger/20",
      ],
    },
    isInvalid: {
      true: "border-danger/70 bg-danger/20",
    },
    isDisabled: {
      true: "opacity-50",
    },
  },
});

interface RadioProps extends RadioPrimitiveProps {
  description?: string;
  ref?: React.Ref<HTMLLabelElement>;
}

const Radio = ({ description, ref, ...props }: RadioProps) => {
  return (
    <RadioPrimitive
      ref={ref}
      className={composeTailwindRenderProps(
        props.className,
        "group flex items-center gap-2 text-fg text-sm transition disabled:text-fg/50 forced-colors:data-disabled:text-[GrayText]",
      )}
      {...props}
    >
      {(renderProps) => (
        <div
          className={cn(
            "flex gap-2",
            "description" in props ? "items-start" : "items-center",
          )}
        >
          <div
            className={radioStyles({
              ...renderProps,
              className: "description" in props ? "mt-1" : "",
            })}
          />
          <div className="flex flex-col gap-1">
            {props.children as React.ReactNode}
            {description && (
              <Description className="block">{description}</Description>
            )}
          </div>
        </div>
      )}
    </RadioPrimitive>
  );
};

export { Radio, RadioGroup };
export type { RadioGroupProps, RadioProps };
