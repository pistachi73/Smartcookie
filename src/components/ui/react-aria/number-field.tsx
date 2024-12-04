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
    placeholder: InputProps["placeholder"];
  };

export const NumberField = ({
  size,
  label,
  description,
  errorMessage,
  placeholder,
  ...props
}: NumberFieldProps) => {
  return (
    <AriaNumberField {...props} className={"flex flex-col gap-1"}>
      {label && <Label className="text-sm">{label}</Label>}

      <Group className={cn(fieldWrapperVariants({ size }), "pr-0")}>
        <Input placeholder={placeholder} className="flex-1" />
        <div className="h-full flex flex-col">
          <Button
            variant="outline"
            className={cn(
              "h-1/2 w-6 border-0 border-b border-l p-0 rounded-none text-neutral-500",
            )}
            type="button"
            slot="increment"
          >
            <ArrowUp01Icon size={12} />
          </Button>
          <Button
            variant="outline"
            type="button"
            className={cn(
              "h-1/2 w-6  p-0 border-0 border-l rounded-none  text-neutral-500",
            )}
            slot="decrement"
          >
            <ArrowDown01Icon size={12} />
          </Button>
        </div>
      </Group>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      {errorMessage && <FieldError> {errorMessage}</FieldError>}
    </AriaNumberField>
  );
};
