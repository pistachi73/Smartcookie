"use client";

import {
  CALENDAR_EVENT_COLORS_ARRAY,
  CALENDAR_EVENT_COLORS_MAP,
  DEFAULT_EVENT_COLOR,
} from "@/features/calendar/lib/utils";
import {
  Button,
  type PopoverContentProps,
  Select,
  type SelectProps,
} from "@/shared/components/ui";
import { cn } from "@/shared/lib/classes";
import { Tick01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { ListBoxItem } from "react-aria-components";

interface EventColorPickerProps<T extends object>
  extends Omit<SelectProps<T>, "className"> {
  selectedKey?: string;
  popoverProps?: Omit<PopoverContentProps, "children">;
}

export const EventColorPicker = <T extends object>({
  selectedKey,
  popoverProps,
  ...props
}: EventColorPickerProps<T>) => {
  const selectedColor = selectedKey
    ? CALENDAR_EVENT_COLORS_MAP.get(selectedKey as string)
    : CALENDAR_EVENT_COLORS_MAP.get(DEFAULT_EVENT_COLOR);

  return (
    <Select
      className="w-10.5"
      selectedKey={selectedKey}
      defaultSelectedKey={DEFAULT_EVENT_COLOR}
      {...props}
    >
      <Button
        appearance="outline"
        shape="square"
        size="small"
        className="data-hovered:bg-overlay-highlight"
      >
        <div
          className={cn(
            "size-5 rounded-xs shrink-0 transition-colors brightness-150 ",
            selectedColor?.className,
          )}
        />
      </Button>
      <Select.List
        className={{
          popover: "min-w-auto p-2",
          list: "grid grid-cols-2 gap-2",
        }}
        items={CALENDAR_EVENT_COLORS_ARRAY}
        popoverProps={popoverProps}
      >
        {({ name, id, className }) => (
          <ListBoxItem id={id} textValue={name}>
            {({ isSelected }) => (
              <div
                className={cn(
                  "size-7 rounded-xs shrink-0 flex items-center justify-center brightness-150 hover:brightness-125",
                  className,
                )}
              >
                {isSelected && <HugeiconsIcon icon={Tick01Icon} size={20} />}
              </div>
            )}
          </ListBoxItem>
        )}
      </Select.List>
    </Select>
  );
};
