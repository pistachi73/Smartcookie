"use client";

import type {
  FieldErrorProps as FieldErrorPrimitiveProps,
  GroupProps,
  InputProps as InputPrimitiveProps,
  LabelProps,
  TextFieldProps as TextFieldPrimitiveProps,
  TextProps,
  ValidationResult,
} from "react-aria-components";
import {
  composeRenderProps,
  FieldError as FieldErrorPrimitive,
  Group,
  Input as InputPrimitive,
  Label as LabelPrimitive,
  Text,
} from "react-aria-components";
import type { RefCallBack } from "react-hook-form";
import { tv } from "tailwind-variants";

import { composeTailwindRenderProps, focusStyles } from "./primitive";

interface FieldProps {
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  "aria-label"?: TextFieldPrimitiveProps["aria-label"];
  "aria-labelledby"?: TextFieldPrimitiveProps["aria-labelledby"];
}

export const fieldStyles = tv({
  slots: {
    description: "text-pretty text-muted-fg text-sm/6",
    label: "w-fit cursor-default font-medium text-secondary-fg text-sm",
    fieldError: "text-danger text-sm/6 forced-colors:text-[Mark]",
    input: [
      "w-full min-w-0 bg-transparent px-3 py-2 text-base text-fg placeholder-muted-fg outline-hidden data-focused:outline-hidden [&::-ms-reveal]:hidden",
    ],
  },
});

const { description, label, fieldError, input } = fieldStyles();

const Label = ({
  className,
  isRequired,
  children,
  ...props
}: LabelProps & { isRequired?: boolean }) => {
  return (
    <LabelPrimitive {...props} className={label({ className })}>
      {children}
      {isRequired && <span className="text-danger">*</span>}
    </LabelPrimitive>
  );
};

interface DescriptionProps extends TextProps {
  isWarning?: boolean;
  ref?: React.RefObject<HTMLElement>;
}

const Description = ({ ref, className, ...props }: DescriptionProps) => {
  const isWarning = props.isWarning ?? false;
  return (
    <Text
      ref={ref}
      {...props}
      slot="description"
      className={description({
        className: isWarning ? "text-warning" : className,
      })}
    />
  );
};

interface FieldErrorProps extends FieldErrorPrimitiveProps {
  ref?: React.RefObject<HTMLElement>;
}
const FieldError = ({
  className,
  ref,
  children,
  ...props
}: FieldErrorProps) => {
  return (
    <FieldErrorPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(className, fieldError())}
    >
      {children}
    </FieldErrorPrimitive>
  );
};

const fieldGroupStyles = tv({
  base: [
    "group flex items-center h-10 overflow-hidden rounded-lg border border-input transition duration-200 ease-out",
    "focus-within:ring-4 group-data-invalid:focus-within:border-danger group-data-invalid:focus-within:ring-danger/20",
    "[&>[role=progressbar]]:mr-2.5",
    "**:data-[slot=icon]:size-4 **:data-[slot=icon]:shrink-0",
    "*:data-[slot=suffix]:mr-2.5 *:data-[slot=suffix]:text-muted-fg",
    "*:data-[slot=prefix]:ml-2.5 *:data-[slot=prefix]:text-muted-fg",
  ],
  variants: {
    isFocusWithin: focusStyles.variants.isFocused,
    isInvalid: focusStyles.variants.isInvalid,
    isDisabled: {
      true: "opacity-50 forced-colors:border-[GrayText]",
    },

    size: {
      "extra-small": "h-8",
      small: "h-10",
      medium: "h-12",
      large: "h-14",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface FieldGroupProps extends GroupProps {
  size?: "medium" | "large" | "small" | "extra-small";
}

const FieldGroup = ({ className, size, ...props }: FieldGroupProps) => {
  return (
    <Group
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        fieldGroupStyles({
          ...renderProps,
          className,
          size,
        }),
      )}
    />
  );
};

interface InputProps extends InputPrimitiveProps {
  ref?: React.RefObject<HTMLInputElement> | RefCallBack;
}
const Input = ({ className, ref, ...props }: InputProps) => {
  return (
    <InputPrimitive
      ref={ref}
      {...props}
      className={composeTailwindRenderProps(className, input())}
    />
  );
};

export { Description, FieldError, FieldGroup, Input, Label };
export type { FieldErrorProps, FieldProps, InputProps };
