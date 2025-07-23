"use client";

import {
  composeRenderProps,
  TextArea as TextAreaPrimitive,
  TextField as TextFieldPrimitive,
  type TextFieldProps as TextFieldPrimitiveProps,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, FieldError, Label } from "./field";
import { composeTailwindRenderProps, focusStyles } from "./primitive";

const textareaStyles = tv({
  extend: focusStyles,
  base: "min-h-10 flex-1 field-sizing-content resize-none w-full min-w-0 rounded-lg border border-input px-2.5 py-2 text-base shadow-xs outline-hidden transition-colors duration-200 data-disabled:opacity-50",
});

interface TextareaProps extends Omit<TextFieldPrimitiveProps, "className"> {
  autoSize?: boolean;
  label?: string;
  placeholder?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  className?: {
    primitive?: string;
    textarea?: string;
  };
}

const Textarea = ({
  className,
  placeholder,
  label,
  description,
  errorMessage,
  ...props
}: TextareaProps) => {
  return (
    <TextFieldPrimitive
      {...props}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group flex flex-col gap-y-1.5",
      )}
    >
      {label && <Label>{label}</Label>}
      <TextAreaPrimitive
        placeholder={placeholder}
        className={composeRenderProps(
          className?.textarea,
          (className, renderProps) =>
            textareaStyles({
              ...renderProps,
              className,
            }),
        )}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </TextFieldPrimitive>
  );
};

export { Textarea };
export type { TextareaProps };
