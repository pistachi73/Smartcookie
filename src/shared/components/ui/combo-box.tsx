"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  MultiplicationSignIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import React from "react";
import type { InputProps } from "react-aria-components";
import {
  Button as ButtonPrimitive,
  ComboBoxContext,
  ComboBoxStateContext,
  ComboBox as ComboboxPrimitive,
  type ComboBoxProps as ComboboxPrimitiveProps,
  type PopoverProps as PopoverPrimitiveProps,
  useSlottedContext,
  type ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";

import { Button } from "./button";
import { DropdownItem, DropdownLabel, DropdownSection } from "./dropdown";
import { Description, FieldError, FieldGroup, Input, Label } from "./field";
import { ListBox } from "./list-box";
import { PopoverContent } from "./popover";
import { composeTailwindRenderProps } from "./primitive";

const comboboxStyles = tv({
  slots: {
    base: "group/combobox flex w-full flex-col gap-y-1.5 test",
    chevronButton:
      "h-7 w-8 rounded outline-offset-0 active:bg-transparent data-hovered:bg-transparent data-pressed:bg-transparent **:data-[slot=icon]:data-pressed:text-fg **:data-[slot=icon]:text-muted-fg **:data-[slot=icon]:hover:text-fg",
    chevronIcon: "size-4 shrink-0 transition duration-200 ",
    clearButton:
      "absolute inset-y-0 right-0 flex items-center pr-2 text-muted-fg data-hovered:text-fg data-focused:outline-hidden",
  },
});

const { base, chevronButton, chevronIcon, clearButton } = comboboxStyles();

interface ComboBoxProps<T extends object>
  extends Omit<ComboboxPrimitiveProps<T>, "children"> {
  label?: string;
  placeholder?: string;
  description?: string | null;
  errorMessage?: string | ((validation: ValidationResult) => string);
  children: React.ReactNode;
}

const ComboBox = <T extends object>({
  label,
  description,
  errorMessage,
  children,
  isRequired,
  className,
  ...props
}: ComboBoxProps<T>) => {
  return (
    <ComboboxPrimitive
      {...props}
      isRequired={isRequired}
      className={composeTailwindRenderProps(className, base())}
    >
      {label && <Label isRequired={isRequired}>{label}</Label>}
      {children}
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </ComboboxPrimitive>
  );
};

type ListBoxPickerProps<T extends object> = React.ComponentProps<
  typeof ListBox<T>
>;

interface ComboBoxListProps<T extends object>
  extends Omit<ListBoxPickerProps<T>, "className">,
    Omit<PopoverPrimitiveProps, "children" | "className" | "style"> {
  showArrow?: boolean;
  className?: {
    popoverContent?: string;
    listBox?: string;
  };
}

const ComboBoxList = <T extends object>({
  children,
  items,
  isOpen,
  triggerRef,
  offset,
  showArrow = false,
  className,
  ...props
}: ComboBoxListProps<T>) => {
  return (
    <PopoverContent
      trigger="ComboBox"
      isOpen={isOpen}
      respectScreen={false}
      isNonModal
      placement={props.placement}
      offset={offset}
      triggerRef={triggerRef}
      showArrow={showArrow}
      className={className?.popoverContent}
    >
      <ListBox.Picker items={items} className={className?.listBox} {...props}>
        {children}
      </ListBox.Picker>
    </PopoverContent>
  );
};

interface ComboBoxInputProps extends Omit<InputProps, "prefix" | "className"> {
  className?: {
    input?: string;
    fieldGroup?: string;
    icon?: string;
  };
  prefix?: React.ReactNode;
  showArrow?: boolean;
}

const ComboBoxInput = ({
  prefix,
  className,
  showArrow = false,
  ...props
}: ComboBoxInputProps) => {
  const context = useSlottedContext(ComboBoxContext)!;

  return (
    <FieldGroup
      className={cn("relative pl-0", prefix && "pl-3.5", className?.fieldGroup)}
    >
      {prefix && <span className="block">{prefix}</span>}
      <Input
        {...props}
        className={cn(prefix && "pl-2 w-full", className?.input)}
        placeholder={props?.placeholder}
      />
      <Button size="square-petite" intent="plain" className={chevronButton()}>
        {!context?.inputValue && showArrow && (
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(chevronIcon(), className?.icon)}
          />
        )}
      </Button>
    </FieldGroup>
  );
};

const ComboBoxClearButton = () => {
  const state = React.use(ComboBoxStateContext);

  return (
    <ButtonPrimitive
      className={clearButton()}
      slot={null}
      aria-label="Clear"
      onPress={() => {
        state?.setSelectedKey(null);
        state?.open();
      }}
    >
      <HugeiconsIcon icon={MultiplicationSignIcon} data-slot="icon" />
    </ButtonPrimitive>
  );
};

ComboBox.Input = ComboBoxInput;
ComboBox.List = ComboBoxList;
ComboBox.Option = DropdownItem;
ComboBox.Label = DropdownLabel;
ComboBox.Section = DropdownSection;

export { ComboBox };
export type { ComboBoxListProps, ComboBoxProps };
