"use client";

import { useState } from "react";

import {
  Button as ButtonPrimitive,
  TextField as TextFieldPrimitive,
} from "react-aria-components";
import { twJoin } from "tailwind-merge";

import { passwordRegex } from "@/components/auth/validation";
import { cn } from "@/lib/utils";
import {
  CheckmarkCircle01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/react";
import { Description, FieldError, FieldGroup, Input, Label } from "./field";
import { composeTailwindRenderProps } from "./primitive";
import type { TextFieldProps } from "./text-field";

type PasswordFieldWithValidationProps = Omit<
  TextFieldProps,
  "type" | "isRevealable"
> & {
  showValidation?: boolean;
};

const PasswordFieldWithValidation = ({
  placeholder,
  label,
  description,
  errorMessage,
  prefix,
  suffix,
  isPending,
  className,
  onChange,
  showValidation,
  ...props
}: PasswordFieldWithValidationProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [validations, setValidations] = useState<
    {
      id: string;
      message: string;
      regex: RegExp;
      valid: boolean;
    }[]
  >(
    passwordRegex.map((regex) => ({
      ...regex,
      valid: false,
    })),
  );

  const inputType = isPasswordVisible ? "text" : "password";
  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onInputChange = (value: string) => {
    setValidations((prev) =>
      prev.map((validation) => ({
        ...validation,
        valid: validation.regex.test(value),
      })),
    );

    onChange?.(value);
  };

  return (
    <TextFieldPrimitive
      type={inputType}
      {...props}
      onChange={onInputChange}
      className={composeTailwindRenderProps(
        className?.primitive,
        "group flex flex-col gap-y-1.5",
      )}
    >
      {!props.children ? (
        <>
          {label && <Label>{label}</Label>}
          <FieldGroup
            isInvalid={!!errorMessage}
            isDisabled={props.isDisabled}
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
            <Input placeholder={placeholder} className={className?.input} />
            <ButtonPrimitive
              type="button"
              aria-label="Toggle password visibility"
              onPress={handleTogglePasswordVisibility}
              className="relative mr-1 grid shrink-0 place-content-center rounded-sm border-transparent outline-hidden data-focus-visible:*:data-[slot=icon]:text-primary *:data-[slot=icon]:text-muted-fg"
            >
              {isPasswordVisible ? (
                <ViewOffSlashIcon size={18} />
              ) : (
                <ViewIcon size={18} />
              )}
            </ButtonPrimitive>
          </FieldGroup>
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>

          {showValidation && (
            <div className="relative mt-0! h-[100px] animate-password-input-div-down">
              <div className="top-0 absolute mt-2 flex animate-password-input-p-down flex-col space-y-1.5 opacity-0 fill-mode-forwards">
                {validations.map(({ message, id, valid }) => (
                  <p
                    key={id}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-light",
                      {
                        "text-muted-fg": !valid,
                        "text-emerald-500 line-through": valid,
                      },
                      className,
                    )}
                  >
                    {valid ? (
                      <CheckmarkCircle01Icon variant="solid" size={16} />
                    ) : (
                      <CheckmarkCircle01Icon size={16} />
                    )}
                    {message}
                  </p>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        props.children
      )}
    </TextFieldPrimitive>
  );
};

export { PasswordFieldWithValidation };
export type { PasswordFieldWithValidationProps };
