import * as React from "react";

import { cn } from "@/lib/utils";
import { Input, TextField } from "react-aria-components";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import { fieldWrapperVariants } from "./shared-styles/field-variants";
import type { TextFieldProps } from "./text-field";

export type CodeFieldProps = TextFieldProps & {
  length: number;
};

const CodeField = React.forwardRef<HTMLInputElement, CodeFieldProps>(
  (
    {
      size,
      placeholder,
      label,
      description,
      errorMessage,
      ariaLabel,
      className,
      length,
      value,
      autoFocus,
      onChange,
      isDisabled,
      ...props
    },
    ref,
  ) => {
    const inputRefs = React.useRef<HTMLInputElement[]>([]);
    const [values, setValues] = React.useState<string[]>(
      new Array(length).fill(""),
    );
    const onInputChange = React.useCallback(
      (event: React.FormEvent<HTMLInputElement>, idx: number) => {
        const newValues = [...values];

        const value = event.currentTarget.value;
        const next = inputRefs.current[idx + 1];

        if (value.length > 1 || Number.isNaN(Number(value))) {
          return;
        }

        if (next && value.length > 0) {
          next.focus();
          next.select();
        }

        newValues[idx] = value;
        setValues(newValues);
        onChange?.(newValues.join("") as any);
      },
      [values, onChange],
    );

    const onKeyUp = (
      event: React.KeyboardEvent<HTMLInputElement>,
      idx: number,
    ) => {
      const prev = inputRefs.current[idx - 1];

      const prevArrowNavigation =
        inputRefs.current[(((idx - 1) % length) + length) % length];
      const nextArrowNavigation = inputRefs.current[(idx + 1) % length];

      const value = event.currentTarget.value;

      if (event.key === "Backspace" && value.length === 0 && prev) {
        prev.focus();
        prev.select();
      }

      if (event.key === "ArrowLeft" && prevArrowNavigation) {
        prevArrowNavigation.focus();
        prevArrowNavigation.select();
      }

      if (event.key === "ArrowRight" && nextArrowNavigation) {
        nextArrowNavigation.focus();
        nextArrowNavigation.select();
      }
    };

    const onPaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const paste = e.clipboardData.getData("text").split("");
      if (paste.every((item) => !Number.isNaN(Number(item)))) {
        const newValue = [...values];
        for (let i = 0; i < paste.length; i++) {
          if (i >= length) break;
          newValue[i] = paste[i] as string;
          inputRefs.current[i]?.focus();
        }

        setValues(newValue);
        onChange?.(newValue.join("") as any);
      }
    };

    React.useEffect(() => {
      autoFocus && inputRefs.current[0]?.focus();
    }, [autoFocus]);

    return (
      <TextField
        {...props}
        value={value}
        isDisabled={isDisabled}
        aria-label={ariaLabel}
      >
        {label && <Label className="text-sm">{label}</Label>}
        <div className="flex w-full flex-row items-center justify-around gap-2">
          {Array.from({ length }).map((_, index) => (
            <Input
              ref={(el) => {
                inputRefs.current[index] = el as HTMLInputElement;
              }}
              key={`input-${index}`}
              className={cn(
                fieldWrapperVariants({ size: "sm" }),
                "size-14 remove-arrow flex text-center text-xl",
                className,
              )}
              value={values[index]}
              type="text"
              onInput={(e) => onInputChange(e, index)}
              onKeyUp={(e) => onKeyUp(e, index)}
              onPaste={onPaste}
            />
          ))}
        </div>
        {description && <FieldDescripton>{description}</FieldDescripton>}
        <FieldError errorMessage={errorMessage} />
      </TextField>
    );
  },
);

CodeField.displayName = "CodeField";

export { CodeField };
