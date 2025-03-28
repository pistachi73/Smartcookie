"use client";

import { useState } from "react";

import type { TextInputDOMProps } from "@react-types/shared";
import {
  Button as ButtonPrimitive,
  TextField as TextFieldPrimitive,
  type TextFieldProps as TextFieldPrimitiveProps,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { ViewIcon, ViewOffSlashIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import type { RefCallBack } from "react-hook-form";
import type { FieldGroupProps, FieldProps } from "./field";
import { Description, FieldError, FieldGroup, Input, Label } from "./field";
import { Loader } from "./loader";
import { composeTailwindRenderProps } from "./primitive";

type InputType = Exclude<TextInputDOMProps["type"], "password">;

interface BaseTextFieldProps
  extends Omit<TextFieldPrimitiveProps, "className">,
    FieldProps {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isPending?: boolean;
  className?: {
    fieldGroup?: string;
    input?: string;
    primitive?: string;
  };
  size?: FieldGroupProps["size"];
  ref?: React.RefObject<HTMLInputElement> | RefCallBack;
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable: true;
  type: "password";
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
  isRevealable?: never;
  type?: InputType;
}

type TextFieldProps = RevealableTextFieldProps | NonRevealableTextFieldProps;

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
  size,
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
      validationBehavior="aria"
      {...props}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group flex flex-col gap-y-1.5",
      )}
    >
      {!props.children ? (
        <>
          {label && <Label isRequired={props.isRequired}>{label}</Label>}
          <FieldGroup
            isInvalid={!!errorMessage}
            isDisabled={props.isDisabled}
            size={"small"}
            className={twJoin(
              "**:[button]:inset-ring-0 **:[button]:inset-shadow-none **:[button]:h-8 **:[button]:rounded-[calc(var(--radius-lg)*0.5)] **:[button]:px-3.5 **:[button]:has-data-[slot=icon]:w-8 **:[button]:has-data-[slot=icon]:p-0 dark:**:[button]:inset-ring-0",
              "[&>[data-slot=suffix]>button]:mr-[calc(var(--spacing)*-1.7)] [&>[data-slot=suffix]>button]:data-focus-visible:outline-1 [&>[data-slot=suffix]>button]:data-focus-visible:outline-offset-1",
              "[&>[data-slot=prefix]>button]:ml-[calc(var(--spacing)*-1.7)] [&>[data-slot=prefix]>button]:data-focus-visible:outline-1 [&>[data-slot=prefix]>button]:data-focus-visible:outline-offset-1",
              className?.fieldGroup,
            )}
            data-loading={isPending ? "true" : undefined}
          >
            {prefix ? (
              <span data-slot="prefix" className="atrs x2e2">
                {prefix}
              </span>
            ) : null}
            <Input
              placeholder={placeholder}
              className={className?.input}
              ref={ref}
            />
            {isRevealable ? (
              <ButtonPrimitive
                type="button"
                aria-label="Toggle password visibility"
                onPress={handleTogglePasswordVisibility}
                className="relative mr-1 grid shrink-0 place-content-center rounded-sm border-transparent outline-hidden data-focus-visible:*:data-[slot=icon]:text-primary *:data-[slot=icon]:text-muted-fg"
              >
                {isPasswordVisible ? (
                  <HugeiconsIcon icon={ViewOffSlashIcon} size={18} />
                ) : (
                  <HugeiconsIcon icon={ViewIcon} size={18} />
                )}
              </ButtonPrimitive>
            ) : isPending ? (
              <Loader variant="spin" data-slot="suffix" />
            ) : suffix ? (
              <span data-slot="suffix">{suffix}</span>
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

export { TextField };
export type { TextFieldProps };
