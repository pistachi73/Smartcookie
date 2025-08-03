"use client";

import type {
  ColorSwatchPickerItemProps as ColorSwatchPickerItemPrimitiveProps,
  ColorSwatchPickerProps,
} from "react-aria-components";
import {
  ColorSwatchPickerItem,
  ColorSwatchPicker as ColorSwatchPickerPrimitive,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { cn } from "@/shared/lib/classes";

import { ColorSwatch } from "./color-swatch";
import { composeTailwindRenderProps, focusRing } from "./primitive";

const ColorSwatchPicker = ({
  children,
  className,
  layout = "grid",
  ...props
}: ColorSwatchPickerProps) => {
  return (
    <ColorSwatchPickerPrimitive
      layout={layout}
      {...props}
      className={composeTailwindRenderProps(className, "flex gap-1")}
    >
      {children}
    </ColorSwatchPickerPrimitive>
  );
};

const itemStyles = tv({
  extend: focusRing,
  base: "relative rounded-lg data-disabled:opacity-50",
});

interface SwatchPickerItemProps
  extends Omit<ColorSwatchPickerItemPrimitiveProps, "className"> {
  className?: {
    primitive?: string;
    swatch?: string;
  };
}

const SwatchPickerItem = ({ className, ...props }: SwatchPickerItemProps) => {
  return (
    <ColorSwatchPickerItem
      {...props}
      className={cn(itemStyles(), className?.primitive)}
    >
      {({ isSelected }) => (
        <>
          <ColorSwatch className={className?.swatch} />
          {isSelected && (
            <div className="absolute top-0 left-0 h-full w-full rounded-[calc(var(--radius-lg)-3.9px)] rounded-md outline-hidden ring-2 ring-fg/50 ring-inset forced-color-adjust-none" />
          )}
        </>
      )}
    </ColorSwatchPickerItem>
  );
};

ColorSwatchPicker.Item = SwatchPickerItem;

export { ColorSwatchPicker };
