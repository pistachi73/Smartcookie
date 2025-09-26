"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@hugeicons-pro/core-solid-rounded";
import type { ValidationResult } from "react-aria-components";
import { ListBoxItem } from "react-aria-components";

import { Button } from "@/shared/components/ui/button";
import type { PopoverContentProps } from "@/shared/components/ui/popover";
import { Select, type SelectProps } from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/classes";
import { DEFAULT_CUSTOM_COLOR } from "@/shared/lib/custom-colors";

// Define available custom colors
export const CUSTOM_COLORS_MAP = new Map([
  [
    "flamingo",
    {
      id: "flamingo",
      name: "Flamingo",
      className: "bg-custom-flamingo-bg",
    },
  ],
  [
    "tangerine",
    { id: "tangerine", name: "Tangerine", className: "bg-custom-tangerine-bg" },
  ],
  [
    "banana",
    { id: "banana", name: "Banana", className: "bg-custom-banana-bg" },
  ],
  ["sage", { id: "sage", name: "Sage", className: "bg-custom-sage-bg" }],
  [
    "peacock",
    { id: "peacock", name: "Peacock", className: "bg-custom-peacock-bg" },
  ],
  [
    "blueberry",
    { id: "blueberry", name: "Blueberry", className: "bg-custom-blueberry-bg" },
  ],
  [
    "lavender",
    { id: "lavender", name: "Lavender", className: "bg-custom-lavender-bg" },
  ],
  ["grape", { id: "grape", name: "Grape", className: "bg-custom-grape-bg" }],
  [
    "graphite",
    { id: "graphite", name: "Graphite", className: "bg-custom-graphite-bg" },
  ],
  [
    "neutral",
    { id: "neutral", name: "Neutral", className: "bg-custom-neutral-bg" },
  ],
  [
    "sunshine",
    { id: "sunshine", name: "Sunshine", className: "bg-custom-sunshine-bg" },
  ],
  ["stone", { id: "stone", name: "Stone", className: "bg-custom-stone-bg" }],
  ["slate", { id: "slate", name: "Slate", className: "bg-custom-slate-bg" }],
]);

export const CUSTOM_COLORS_ARRAY = Array.from(CUSTOM_COLORS_MAP.values());

interface CustomColorPickerProps<T extends object>
  extends Omit<SelectProps<T>, "className"> {
  selectedKey?: string;
  popoverProps?: Omit<PopoverContentProps, "children">;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const CustomColorPicker = <T extends object>({
  selectedKey,
  popoverProps,
  label,
  description,
  errorMessage,
  ...props
}: CustomColorPickerProps<T>) => {
  const selectedColor = selectedKey
    ? CUSTOM_COLORS_MAP.get(selectedKey as string)
    : CUSTOM_COLORS_MAP.get(DEFAULT_CUSTOM_COLOR);

  return (
    <Select
      className="w-10.5"
      selectedKey={selectedKey}
      defaultSelectedKey={DEFAULT_CUSTOM_COLOR}
      label={label}
      description={description}
      errorMessage={errorMessage}
      {...props}
    >
      <Button
        intent="outline"
        size="sq-sm"
        className="size-10 aspect-square data-hovered:bg-overlay-highlight"
      >
        <div
          className={cn(
            "size-5 rounded-xs shrink-0 transition-colors",
            selectedColor?.className,
          )}
        />
      </Button>
      <Select.List
        popover={{ className: "min-w-auto p-2", ...popoverProps }}
        className="grid grid-cols-4 gap-2"
        items={CUSTOM_COLORS_ARRAY}
      >
        {({ name, id, className }) => (
          <ListBoxItem id={id} textValue={name}>
            {({ isSelected }) => (
              <div
                className={cn(
                  "size-7 rounded-xs shrink-0 flex items-center justify-center hover:brightness-110",
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
