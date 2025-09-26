"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons-pro/core-solid-rounded";
import { useState } from "react";
import type {
  InputProps,
  TextFieldProps as TextFieldPrimitiveProps,
} from "react-aria-components";
import { TextField as TextFieldPrimitive } from "react-aria-components";

import { composeTailwindRenderProps } from "@/shared/lib/primitive";
import { cn } from "@/shared/lib/utils";

import type { FieldProps } from "./field";
import { Description, FieldError, FieldGroup, Input, Label } from "./field";
import { Loader } from "./loader";

type InputType = Exclude<InputProps["type"], "password">;

interface BaseTextFieldProps
  extends Omit<TextFieldPrimitiveProps, "className">,
    FieldProps {
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  isPending?: boolean;
  className?: {
    primitive?: string;
    fieldGroup?: string;
    input?: string;
  };
  ref?: React.Ref<HTMLInputElement>;
}

type TextFieldProps =
  | (BaseTextFieldProps & { isRevealable: true; type: "password" })
  | (BaseTextFieldProps & { isRevealable?: never; type?: InputType });

const TextField = ({
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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = isRevealable
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };
  return (
    <TextFieldPrimitive
      type={inputType}
      isDisabled={props.isDisabled}
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
            {prefix && typeof prefix === "string" ? (
              <span className="pl-2 text-muted-fg">{prefix}</span>
            ) : (
              prefix
            )}
            <Input
              ref={ref}
              placeholder={placeholder}
              className={cn(className?.input, "text-base")}
            />
            {isRevealable ? (
              <button
                type="button"
                tabIndex={-1}
                aria-label="Toggle password visibility"
                onClick={handleTogglePasswordVisibility}
                className="relative mr-0.5 grid shrink-0 place-content-center rounded-sm border-transparent outline-hidden *:data-[slot=icon]:text-muted-fg focus-visible:*:data-[slot=icon]:text-primary"
              >
                {isPasswordVisible ? (
                  <HugeiconsIcon icon={ViewOffSlashIcon} data-slot="icon" />
                ) : (
                  <HugeiconsIcon icon={ViewIcon} data-slot="icon" />
                )}
              </button>
            ) : isPending ? (
              <Loader variant="spin" />
            ) : suffix ? (
              typeof suffix === "string" ? (
                <span className="mr-2 text-muted-fg">{suffix}</span>
              ) : (
                suffix
              )
            ) : null}
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

export type { TextFieldProps };
export { TextField };
