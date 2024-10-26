import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { BsCheckCircle, BsCheckCircleFill } from "react-icons/bs";

import { Input } from "./input";

import { passwordRegex } from "@/components/auth/validation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  withValidation?: boolean;
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, withValidation, onChange, ...props }, ref) => {
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
      <Eye className="h-4 w-4" aria-hidden="true" size={16} />
    ) : (
      <EyeOff className="h-4 w-4" aria-hidden="true" size={16} />
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
            className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
          >
            {passwordIcon}
          </Button>
        </div>
        {withValidation && (
          <div className="relative !mt-0 h-[100px] animate-password-input-div-down">
            <div className="t op-0 absolute mt-2 flex animate-password-input-p-down flex-col space-y-1 opacity-0 fill-mode-forwards">
              {validations.map(({ message, id, valid }) => (
                <p
                  key={id}
                  className={cn(
                    "flex items-center gap-1.5 text-sm font-light text-muted-foreground",
                    {
                      "text-muted-foreground": !valid,
                      "text-emerald-500 line-through": valid,
                    },
                    className,
                  )}
                  {...props}
                >
                  {valid ? (
                    <BsCheckCircleFill size={16} />
                  ) : (
                    <BsCheckCircle size={16} />
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
