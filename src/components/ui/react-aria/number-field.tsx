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
    iconSize?: number;
  };

export const NumberField = ({
  size,
  label,
  description,
  errorMessage,
  placeholder,
  className,
  isDisabled,
  iconSize = 12,
  ...props
}: NumberFieldProps) => {
  return (
    <AriaNumberField
      {...props}
      isDisabled={isDisabled}
      className={cn("flex flex-col gap-1")}
    >
      {label && <Label className="text-sm">{label}</Label>}

      <Group
        className={cn(
          fieldWrapperVariants({ size, isDisabled }),
          "overflow-hidden pr-0 flex justify-between items-center",
          className,
        )}
      >
        <Input
          placeholder={placeholder}
          className={cn(
            "flex-1 max-w-[calc(100%-var(--spacing)*8)] text-inherit",
          )}
        />
        <div className="h-full flex flex-col shrink-0">
          <div
            className={"h-1/2 w-6 border-l flex items-center justify-center"}
          >
            <Button
              variant="outline"
              className={cn(
                "h-full w-full p-0 border-0 rounded-none  text-text-sub",
              )}
              type="button"
              slot="increment"
            >
              <ArrowUp01Icon size={iconSize} />
            </Button>
          </div>
          <Separator className="flex-1 h-full " />
          <div
            className={"h-1/2 w-6 border-l flex items-center justify-center"}
          >
            <Button
              variant="outline"
              type="button"
              className={cn(
                "h-full w-full p-0 border-0 rounded-none   text-text-sub",
              )}
              slot="decrement"
            >
              <ArrowDown01Icon size={iconSize} />
            </Button>
          </div>
        </div>
      </Group>
      {description && <FieldDescripton>{description}</FieldDescripton>}
      <FieldError errorMessage={errorMessage} />
    </AriaNumberField>
  );
};
