import { cn } from "@/lib/utils";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/react";
import type {
  NumberFieldProps as AriaNumberFieldProps,
  InputProps,
} from "react-aria-components";
import {
  NumberField as AriaNumberField,
  Group,
  Input,
  Separator,
} from "react-aria-components";
import { Button } from "../button";
import { FieldDescripton } from "./field-description";
import { FieldError } from "./field-error";
import { Label } from "./label";
import {
  type FieldWrapperVariants,
  fieldWrapperVariants,
} from "./shared-styles/field-variants";

type NumberFieldProps = AriaNumberFieldProps &
  FieldWrapperVariants & {
    label?: string;
    description?: string;
    errorMessage?: string;
    placeholder?: InputProps["placeholder"];
  };

export const NumberField = ({
  size,
  label,
  description,
  errorMessage,
  placeholder,
  className,
  ...props
}: NumberFieldProps) => {
  return (
    <AriaNumberField
      {...props}
      className={cn("flex flex-col gap-1", className)}
    >
      {label && <Label className="text-sm">{label}</Label>}

      <Group
        className={cn(
          fieldWrapperVariants({ size }),
          "overflow-hidden pr-0 flex justify-between",
        )}
      >
        <Input
          placeholder={placeholder}
          className="flex-1 max-w-[calc(100%-var(--spacing)*8)]"
        />
        <div className="h-full flex flex-col shrink-0">
          <div className={"h-1/2 w-6 border-l"}>
            <Button
              variant="outline"
              className={cn(
                "h-full w-full p-0 border-0 rounded-none   text-text-sub",
              )}
              type="button"
              slot="increment"
            >
              <ArrowUp01Icon size={12} />
            </Button>
          </div>
          <Separator className="flex-1 h-full " />
          <div className={"h-1/2 w-6 border-l"}>
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-full w-full p-0 border-0 rounded-none   text-text-sub",
              )}
              slot="decrement"
            >
              <ArrowDown01Icon size={12} />
            </Button>
          </div>
        </div>
      </Group>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </AriaNumberField>
  );
};
