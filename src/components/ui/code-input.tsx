import * as React from "react";

import { cn } from "@/lib/utils";

export type CodeInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  length: number;
};

const CodeInput = React.forwardRef<HTMLInputElement, CodeInputProps>(
  ({ className, length, onChange, value, autoFocus, ...props }, ref) => {
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
      <div className="flex w-full flex-row items-center justify-around gap-2">
        {Array.from({ length }).map((_, index) => (
          <input
            ref={(el) => {
              inputRefs.current[index] = el as HTMLInputElement;
            }}
            key={`input-${index}-${values[index]}`}
            className={cn(
              "remove-arrow flex h-14 w-14 rounded-md border border-input bg-background px-3 py-2 text-center text-xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40",
              className,
            )}
            value={values[index]}
            type="text"
            onInput={(e) => onInputChange(e, index)}
            onKeyUp={(e) => onKeyUp(e, index)}
            onPaste={onPaste}
            {...props}
          />
        ))}
      </div>
    );
  },
);

CodeInput.displayName = "CodeInput";

export { CodeInput };
