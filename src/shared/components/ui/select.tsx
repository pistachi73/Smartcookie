"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons-pro/core-stroke-rounded";
import type {
  ListBoxProps,
  SelectProps as SelectPrimitiveProps,
  ValidationResult,
} from "react-aria-components";
import {
  Button,
  composeRenderProps,
  Select as SelectPrimitive,
  SelectValue,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import {
  DropdownDescription,
  DropdownItem,
  DropdownLabel,
  DropdownSection,
  DropdownSeparator,
} from "@/ui/dropdown";

import { Description, FieldError, Label } from "./field";
import { ListBox } from "./list-box";
import { PopoverContent, type PopoverContentProps } from "./popover";
import { composeTailwindRenderProps, focusStyles } from "./primitive";

interface SelectProps<T extends object> extends SelectPrimitiveProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  className?: string;
}

const Select = <T extends object>({
  label,
  description,
  errorMessage,
  children,
  className,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectPrimitive
      {...props}
      className={composeTailwindRenderProps(
        className,
        "group flex w-full flex-col gap-y-1.5",
      )}
    >
      {(values) => (
        <>
          {label && <Label>{label}</Label>}
          {typeof children === "function" ? children(values) : children}
          {description && <Description>{description}</Description>}
          <FieldError>{errorMessage}</FieldError>
        </>
      )}
    </SelectPrimitive>
  );
};

interface ListProps<T extends object>
  extends Omit<ListBoxProps<T>, "className"> {
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  className?: {
    popover?: string;
    list?: string;
  };
  popoverProps?: Omit<PopoverContentProps, "children" | "className">;
}

const List = <T extends object>({
  className,
  children,
  items,
  popoverProps,
  ...props
}: ListProps<T>) => {
  return (
    <PopoverContent
      {...popoverProps}
      showArrow={false}
      respectScreen={false}
      className={composeTailwindRenderProps(
        className?.popover,
        "sm:min-w-(--trigger-width)",
      )}
    >
      <ListBox.Picker
        aria-label="items"
        items={items}
        {...props}
        className={className?.list}
      >
        {children}
      </ListBox.Picker>
    </PopoverContent>
  );
};

const selectTriggerStyles = tv({
  extend: focusStyles,
  base: [
    "btr flex h-10 w-full cursor-default items-center gap-4 gap-x-2 rounded-lg border border-input py-2 pr-2 pl-3 text-start shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition **:data-[slot=icon]:size-4 group-data-disabled:opacity-50 dark:shadow-none",
    "group-data-open:border-ring/70 group-data-open:ring-4 group-data-open:ring-ring/20",
    "text-fg group-data-invalid:border-danger group-data-invalid:ring-danger/20 forced-colors:group-data-invalid:border-[Mark]",
  ],
  variants: {
    isDisabled: {
      true: "opacity-50 forced-colors:border-[GrayText] forced-colors:text-[GrayText]",
    },
  },
});

interface SelectTriggerProps extends React.ComponentProps<typeof Button> {
  prefix?: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

const SelectTrigger = ({
  className,
  showArrow,
  prefix,
  ...props
}: SelectTriggerProps) => {
  return (
    <Button
      className={composeRenderProps(className, (className, renderProps) =>
        selectTriggerStyles({
          ...renderProps,
          className,
        }),
      )}
      {...props}
    >
      {prefix && <span>{prefix}</span>}
      <div className="w-full overflow-hidden">
        <SelectValue className="truncate *:data-[slot=icon]:-mx-0.5 *:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:*:-mx-0.5 grid flex-1 grid-cols-[auto_1fr] items-center text-base data-placeholder:text-muted-fg *:data-[slot=avatar]:*:mr-2 *:data-[slot=avatar]:mr-2 *:data-[slot=icon]:mr-2 sm:text-sm [&_[slot=description]]:hidden" />
      </div>
      {showArrow && (
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          aria-hidden
          data-slot="icon"
          className="size-4 shrink-0 text-muted-fg duration-300 group-data-open:rotate-180 group-data-open:text-fg group-data-disabled:opacity-50 forced-colors:text-[ButtonText] forced-colors:group-data-disabled:text-[GrayText]"
        />
      )}
    </Button>
  );
};

const SelectSection = DropdownSection;
const SelectSeparator = DropdownSeparator;
const SelectLabel = DropdownLabel;
const SelectDescription = DropdownDescription;
const SelectOption = DropdownItem;

Select.Description = SelectDescription;
Select.Option = SelectOption;
Select.Label = SelectLabel;
Select.Separator = SelectSeparator;
Select.Section = SelectSection;
Select.Trigger = SelectTrigger;
Select.List = List;

export { Select };
export type { SelectProps, SelectTriggerProps };
