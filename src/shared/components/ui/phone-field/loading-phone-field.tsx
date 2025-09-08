"use client";

import { TextField as TextFieldPrimitive } from "react-aria-components";

import { composeTailwindRenderProps } from "@/shared/lib/primitive";
import { cn } from "@/shared/lib/utils";

import { Description, FieldError, FieldGroup, Input, Label } from "../field";
import type { TextFieldProps } from "../text-field";

export const LoadingPhoneField = ({
  placeholder,
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  isPending,
  className,
  isRevealable,
  type,
  ref,
  ...props
}: TextFieldProps) => {
  return (
    <TextFieldPrimitive
      type={"text"}
      {...props}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group flex flex-col gap-y-1 *:data-[slot=label]:font-medium",
      )}
      validationBehavior="aria"
    >
      {!props.children ? (
        <>
          {label && <Label isRequired={props.isRequired}>{label}</Label>}
          <FieldGroup
            isDisabled={props.isDisabled}
            isInvalid={!!errorMessage}
            className={cn(isRevealable && "pr-9", className?.fieldGroup)}
            data-loading={isPending ? "true" : undefined}
          >
            <Input
              ref={ref}
              placeholder={placeholder}
              className={cn(className?.input, "text-base")}
            />
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      ) : (
        props.children
      )}
    </TextFieldPrimitive>
  );
};
