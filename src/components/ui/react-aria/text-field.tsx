import {
  TextField as AriaTextField,
  Input,
  TextArea,
} from "react-aria-components";

import type {
  TextFieldProps as AriaTextFieldProps,
  InputProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import {
  type FieldWrapperVariants,
  fieldWrapperVariants,
} from "./shared-styles/field-variants";

type TextFieldProps = AriaTextFieldProps &
  FieldWrapperVariants & {
    placeholder?: InputProps["placeholder"];
    ariaLabel?: InputProps["aria-label"];
  } & {
    label?: string;
    description?: string;
    errorMessage?: string;
    type?: "input" | "textarea";
  };

export const TextField = ({
  size,
  className,
  placeholder,
  label,
  description,
  errorMessage,
  ariaLabel,
  value,
  type = "input",
  isDisabled,
  ...props
}: TextFieldProps) => {
  return (
    <AriaTextField {...props} value={value} isDisabled={isDisabled}>
      {label && <Label className="text-sm">{label}</Label>}
      <div
        className={cn(
          fieldWrapperVariants({ size, isDisabled }),
          type === "textarea" && "h-auto",
          className,
        )}
      >
        {type === "input" ? (
          <Input
            placeholder={placeholder}
            className="flex-1"
            aria-label={ariaLabel}
          />
        ) : (
          <TextArea
            placeholder={placeholder}
            className={({ isFocused }) =>
              cn(
                "flex-1 field-sizing-content my-2 resize-none",
                isFocused || value ? "min-h-12" : "h-full",
              )
            }
            aria-label={ariaLabel}
          />
        )}
      </div>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </AriaTextField>
  );
};
