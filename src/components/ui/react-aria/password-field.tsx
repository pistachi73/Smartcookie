import * as React from "react";

import { passwordRegex } from "@/components/auth/validation";
import { cn } from "@/lib/utils";
import {
  CheckmarkCircle01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/react";
import { Input } from "react-aria-components";
import { Button } from "../button";
import { fieldWrapperVariants } from "./shared-styles/field-variants";
import type { TextFieldProps } from "./text-field";

import { TextField as AriaTextField } from "react-aria-components";

import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";

export type PasswordFieldProps = TextFieldProps & {
  withValidation?: boolean;
};

const PasswordField = ({
  placeholder,
  label,
  description,
  errorMessage,
  ariaLabel,
  value,
  type = "input",
  className,
  isDisabled,
  withValidation,
  onChange,
  size,
  ...props
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [validations, setValidations] = React.useState<
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

  const passwordIcon = showPassword ? (
    <ViewIcon aria-hidden="true" size={18} />
  ) : (
    <ViewOffSlashIcon aria-hidden="true" size={18} />
  );

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
    <AriaTextField
      {...props}
      value={value}
      isDisabled={isDisabled}
      onChange={onInputChange}
    >
      {label && <Label className="text-sm">{label}</Label>}
      <div
        className={cn(
          "relative",
          fieldWrapperVariants({ size, isDisabled }),
          className,
        )}
      >
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={
            "&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
          }
          className={cn("flex-1 hide-password-toggle pr-10", className)}
          aria-label={ariaLabel}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          iconOnly
          className="absolute right-0 top-0 h-full px-3 py-2 text-text-sub hover:text-responsive-dark hover:bg-transparent focus-visible:ring-0 focus-visible:border-0"
          excludeFromTabOrder
          onPress={() => setShowPassword((prev) => !prev)}
          isDisabled={isDisabled}
        >
          {passwordIcon}
        </Button>
      </div>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      {errorMessage && <FieldError errorMessage={errorMessage} />}
      {withValidation && (
        <div className="relative mt-0! h-[100px] animate-password-input-div-down">
          <div className="top-0 absolute mt-2 flex animate-password-input-p-down flex-col space-y-1.5 opacity-0 fill-mode-forwards">
            {validations.map(({ message, id, valid }) => (
              <p
                key={id}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-light",
                  {
                    "text-text-sub": !valid,
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
    </AriaTextField>
  );
};

export { PasswordField };
