"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Tick02Icon } from "@hugeicons-pro/core-stroke-rounded";
import type {
  ListBoxItemProps as ListBoxItemPrimitiveProps,
  ListBoxProps,
} from "react-aria-components";
import {
  composeRenderProps,
  ListBoxItem as ListBoxItemPrimitive,
  ListBox as ListBoxPrimitive,
} from "react-aria-components";

import { cn } from "@/shared/lib/classes";

import {
  DropdownDescription,
  DropdownLabel,
  DropdownSection,
  dropdownItemStyles,
} from "./dropdown";
import { composeTailwindRenderProps } from "./primitive";

const ListBox = <T extends object>({
  className,
  ...props
}: ListBoxProps<T>) => (
  <ListBoxPrimitive
    {...props}
    className={composeTailwindRenderProps(
      className,
      "grid max-h-96 w-full min-w-56 scroll-py-1 grid-cols-[auto_1fr] flex-col gap-y-1 overflow-y-scroll overscroll-contain rounded-xl border p-1 shadow-lg outline-hidden [scrollbar-width:thin] [&::-webkit-scrollbar]:size-0.5 *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1",
    )}
  />
);

interface ListBoxItemProps<T extends object>
  extends ListBoxItemPrimitiveProps<T> {
  className?: string;
}

const ListBoxItem = <T extends object>({
  children,
  className,
  ...props
}: ListBoxItemProps<T>) => {
  const textValue = typeof children === "string" ? children : undefined;

  return (
    <ListBoxItemPrimitive
      textValue={textValue}
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        dropdownItemStyles({
          ...renderProps,
          className,
        }),
      )}
    >
      {(renderProps) => (
        <div className="flex items-center gap-2">
          <>
            {renderProps.allowsDragging && (
              <HugeiconsIcon
                icon={Menu01Icon}
                data-slot="icon"
                className={cn(
                  "size-4 shrink-0 text-muted-fg transition",
                  renderProps.isFocused && "text-fg",
                  renderProps.isDragging && "text-fg",
                  renderProps.isSelected && "text-accent-fg/70",
                )}
              />
            )}
            {renderProps.isSelected && (
              <HugeiconsIcon
                icon={Tick02Icon}
                className="-mx-0.5 mr-2"
                data-slot="checked-icon"
              />
            )}
            {typeof children === "function" ? (
              children(renderProps)
            ) : typeof children === "string" ? (
              <DropdownLabel>{children}</DropdownLabel>
            ) : (
              children
            )}
          </>
        </div>
      )}
    </ListBoxItemPrimitive>
  );
};

type ListBoxPickerProps<T> = ListBoxProps<T>;

const ListBoxPicker = <T extends object>({
  className,
  ...props
}: ListBoxPickerProps<T>) => {
  return (
    <ListBoxPrimitive
      className={composeTailwindRenderProps(
        className,
        "grid max-h-72 grid-cols-[auto_1fr] overflow-auto p-1 outline-hidden *:[[role='group']+[role=group]]:mt-4 *:[[role='group']+[role=separator]]:mt-1",
      )}
      {...props}
    />
  );
};

const ListBoxSection = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownSection>) => {
  return (
    <DropdownSection
      className={cn(className, "[&_.lbi:last-child]:-mb-1.5 gap-y-1")}
      {...props}
    />
  );
};

const ListBoxLabel = DropdownLabel;
const ListBoxDescription = DropdownDescription;

ListBox.Section = ListBoxSection;
ListBox.Label = ListBoxLabel;
ListBox.Description = ListBoxDescription;
ListBox.Item = ListBoxItem;
ListBox.Picker = ListBoxPicker;

export { ListBox };
export type { ListBoxItemProps, ListBoxPickerProps };
