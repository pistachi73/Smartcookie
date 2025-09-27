"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  CheckmarkCircle01Icon as CheckmarkCircle01IconSolid,
} from "@hugeicons-pro/core-solid-rounded";
import { useState } from "react";

import { cn } from "@/shared/lib/classes";

import { passwordRegex } from "@/features/auth/lib/validation";
import { TextField, type TextFieldProps } from "./text-field";

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
    <div className="relative group flex flex-col gap-y-1.5">
      <TextField
        label={label}
        isRevealable
        type="password"
        onChange={onInputChange}
        {...props}
      />

      {showValidation && (
        <div className="relative mt-0! h-[90px] animate-password-input-div-down">
          <div className="top-0 absolute mt-2 flex animate-password-input-p-down flex-col space-y-1.5 opacity-0 fill-mode-forwards">
            {validations.map(({ message, id, valid }) => (
              <p
                key={id}
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  {
                    "text-muted-fg": !valid,
                    "text-success line-through": valid,
                  },
                  className,
                )}
              >
                {valid ? (
                  <HugeiconsIcon icon={CheckmarkCircle01IconSolid} size={16} />
                ) : (
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
                )}
                {message}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { PasswordFieldWithValidation };
export type { PasswordFieldWithValidationProps };
