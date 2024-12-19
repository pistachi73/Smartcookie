import * as React from "react";

import { Input } from "./input";

import { passwordRegex } from "@/components/auth/validation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckmarkCircle01Icon,
  ViewIcon,
  ViewOffSlashIcon,
} from "@hugeicons/react";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  withValidation?: boolean;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, withValidation, onChange, size, ...props }, ref) => {
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

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setValidations((prev) =>
        prev.map((validation) => ({
          ...validation,
          valid: validation.regex.test(value),
        })),
      );

      onChange?.(event);
    };

    return (
      <>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("hide-password-toggle pr-10", className)}
            ref={ref}
            onChange={onInputChange}
            {...props}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconOnly
            className="absolute right-0 top-0 h-full px-3 py-2 text-text-sub hover:text-responsive-dark hover:bg-transparent"
            onPress={() => setShowPassword((prev) => !prev)}
            isDisabled={disabled}
          >
            {passwordIcon}
          </Button>
        </div>
        {withValidation && (
          <div className="relative mt-0! h-[100px] animate-password-input-div-down">
            <div className="top-0 absolute mt-2 flex animate-password-input-p-down flex-col space-y-1 opacity-0 fill-mode-forwards">
              {validations.map(({ message, id, valid }) => (
                <p
                  key={id}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-light",
                    {
                      "text-text-sub": !valid,
                      "text-emerald-500 line-through": valid,
                    },
                    className,
                  )}
                  {...props}
                >
                  {valid ? (
                    <CheckmarkCircle01Icon variant="solid" size={18} />
                  ) : (
                    <CheckmarkCircle01Icon size={18} />
                  )}
                  {message}
                </p>
              ))}
            </div>
          </div>
        )}
      </>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
