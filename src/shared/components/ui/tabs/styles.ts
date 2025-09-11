import { tv } from "tailwind-variants";

export const tabsStyles = tv({
  base: "group/tabs flex gap-4 forced-color-adjust-none",
  variants: {
    orientation: {
      horizontal: "flex-col",
      vertical: "w-[800px] flex-row",
    },
  },
});

export const tabListStyles = tv({
  base: "flex forced-color-adjust-none h-12 shrink-0 overflow-auto overflow-y-visible no-scrollbar",
  variants: {
    orientation: {
      horizontal: "flex-row gap-x-5 border-border border-b",
      vertical: "flex-col items-start gap-y-4 border-l",
    },
  },
});

export const tabStyles = tv({
  base: [
    "relative flex cursor-default items-center whitespace-nowrap rounded-full font-medium text-sm outline-hidden transition hover:text-fg *:data-[slot=icon]:mr-2 *:data-[slot=icon]:size-4",
    "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:py-0 group-data-[orientation=vertical]/tabs:pr-2 group-data-[orientation=vertical]/tabs:pl-4",
    "group-data-[orientation=horizontal]/tabs:pb-3",
  ],
  variants: {
    isSelected: {
      false: "text-muted-fg",
      true: "text-fg",
    },
    isFocused: { false: "ring-0", true: "text-fg" },
    isDisabled: {
      true: "text-muted-fg/50",
    },
  },
});

export const tabPanelStyles =
  "flex-1 text-fg text-sm focus-visible:outline-hidden";

export const selectedIndicatorStyles = [
  "absolute rounded bg-primary",
  // horizontal
  "group-data-[orientation=horizontal]/tabs:-bottom-px group-data-[orientation=horizontal]/tabs:inset-x-0 group-data-[orientation=horizontal]/tabs:h-0.5 group-data-[orientation=horizontal]/tabs:w-full",
  // vertical
  "group-data-[orientation=vertical]/tabs:left-0 group-data-[orientation=vertical]/tabs:h-[calc(100%-10%)] group-data-[orientation=vertical]/tabs:w-0.5 group-data-[orientation=vertical]/tabs:transform",
].join(" ");
