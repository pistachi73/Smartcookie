import type { CustomColor } from "@/db/schema/shared";

export interface CustomColorClasses {
  bg: string;
  border: string;
  text: string;
  dot: string;
  focusVisible: string;
  ring: string;
}

export const DEFAULT_CUSTOM_COLOR: CustomColor = "neutral";

/**
 * Maps custom color enum values to Tailwind classes
 * Uses the custom color variables from globals.css with optimized opacity and contrast
 * Text colors use existing color variables from globals.css for consistency
 */
export const colorStyleMap: Record<CustomColor, CustomColorClasses> = {
  flamingo: {
    bg: "bg-(--custom-flamingo-bg-tint)",
    border: "border-(--custom-flamingo-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-flamingo-bg)",
    focusVisible: "focus-visible:ring-(--custom-flamingo-bg-shade)",
    ring: "ring-(--custom-flamingo-bg-shade)",
  },
  tangerine: {
    bg: "bg-(--custom-tangerine-bg-tint)",
    border: "border-(--custom-tangerine-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-tangerine-bg)",
    focusVisible: "focus-visible:ring-(--custom-tangerine-bg-shade)",
    ring: "ring-(--custom-tangerine-bg-shade)",
  },
  banana: {
    bg: "bg-(--custom-banana-bg-tint)",
    border: "border-(--custom-banana-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-banana-bg)",
    focusVisible: "focus-visible:ring-(--custom-banana-bg-shade)",
    ring: "ring-(--custom-banana-bg-shade)",
  },
  sage: {
    bg: "bg-(--custom-sage-bg-tint)",
    border: "border-(--custom-sage-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-sage-bg)",
    focusVisible: "focus-visible:ring-(--custom-sage-bg-shade)",
    ring: "ring-(--custom-sage-bg-shade)",
  },
  peacock: {
    bg: "bg-(--custom-peacock-bg-tint)",
    border: "border-(--custom-peacock-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-peacock-bg)",
    focusVisible: "focus-visible:ring-(--custom-peacock-bg-shade)",
    ring: "ring-(--custom-peacock-bg-shade)",
  },
  blueberry: {
    bg: "bg-(--custom-blueberry-bg-tint)",
    border: "border-(--custom-blueberry-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-blueberry-bg)",
    focusVisible: "focus-visible:ring-(--custom-blueberry-bg-shade)",
    ring: "ring-(--custom-blueberry-bg-shade)",
  },
  lavender: {
    bg: "bg-(--custom-lavender-bg-tint)",
    border: "border-(--custom-lavender-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-lavender-bg)",
    focusVisible: "focus-visible:ring-(--custom-lavender-bg-shade)",
    ring: "ring-(--custom-lavender-bg-shade)",
  },
  grape: {
    bg: "bg-(--custom-grape-bg-tint)",
    border: "border-(--custom-grape-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-grape-bg)",
    focusVisible: "focus-visible:ring-(--custom-grape-bg-shade)",
    ring: "ring-(--custom-grape-bg-shade)",
  },
  graphite: {
    bg: "bg-(--custom-graphite-bg-tint)",
    border: "border-(--custom-graphite-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-graphite-bg)",
    focusVisible: "focus-visible:ring-(--custom-graphite-bg-shade)",
    ring: "ring-(--custom-graphite-bg-shade)",
  },
  neutral: {
    bg: "bg-(--custom-neutral-bg-tint)",
    border: "border-(--custom-neutral-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-neutral-bg)",
    focusVisible: "focus-visible:ring-(--custom-neutral-bg-shade)",
    ring: "ring-(--custom-neutral-bg-shade)",
  },
  sunshine: {
    bg: "bg-(--custom-sunshine-bg-tint)",
    border: "border-(--custom-sunshine-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-sunshine-bg)",
    focusVisible: "focus-visible:ring-(--custom-sunshine-bg-shade)",
    ring: "ring-(--custom-sunshine-bg-shade)",
  },
  stone: {
    bg: "bg-(--custom-stone-bg-tint)",
    border: "border-(--custom-stone-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-stone-bg)",
    focusVisible: "focus-visible:ring-(--custom-stone-bg-shade)",
    ring: "ring-(--custom-stone-bg-shade)",
  },
  slate: {
    bg: "bg-(--custom-slate-bg-tint)",
    border: "border-(--custom-slate-bg-shade)",
    text: "text-fg dark:text-fg",
    dot: "bg-(--custom-slate-bg)",
    focusVisible: "focus-visible:ring-(--custom-slate-bg-shade)",
    ring: "ring-(--custom-slate-bg-shade)",
  },
};

export const hubCardColorStyleMap: Record<
  CustomColor,
  { hover: string; dot: string }
> = {
  flamingo: {
    hover: "hover:border-(--custom-flamingo-bg-shade)",
    dot: "bg-(--custom-flamingo-bg)",
  },
  tangerine: {
    hover: "hover:border-(--custom-tangerine-bg-shade)",
    dot: "bg-(--custom-tangerine-bg)",
  },
  banana: {
    hover: "hover:border-(--custom-banana-bg-shade)",
    dot: "bg-(--custom-banana-bg)",
  },
  sage: {
    hover: "hover:border-(--custom-sage-bg-shade)",
    dot: "bg-(--custom-sage-bg)",
  },
  peacock: {
    hover: "hover:border-(--custom-peacock-bg-shade)",
    dot: "bg-(--custom-peacock-bg)",
  },
  blueberry: {
    hover: "hover:border-(--custom-blueberry-bg-shade)",
    dot: "bg-(--custom-blueberry-bg)",
  },
  lavender: {
    hover: "hover:border-(--custom-lavender-bg-shade)",
    dot: "bg-(--custom-lavender-bg)",
  },
  grape: {
    hover: "hover:border-(--custom-grape-bg-shade)",
    dot: "bg-(--custom-grape-bg)",
  },
  graphite: {
    hover: "hover:border-(--custom-graphite-bg-shade)",
    dot: "bg-(--custom-graphite-bg)",
  },
  neutral: {
    hover: "hover:border-(--custom-neutral-bg-shade)",
    dot: "bg-(--custom-neutral-bg)",
  },
  sunshine: {
    hover: "hover:border-(--custom-sunshine-bg-shade)",
    dot: "bg-(--custom-sunshine-bg)",
  },
  stone: {
    hover: "hover:border-(--custom-stone-bg-shade)",
    dot: "bg-(--custom-stone-bg)",
  },
  slate: {
    hover: "hover:border-(--custom-slate-bg-shade)",
    dot: "bg-(--custom-slate-bg)",
  },
};

/**
 * Get Tailwind classes for a custom color
 * @param color Custom color enum value
 * @returns Object with Tailwind classes for background, border, and text
 */
export function getCustomColorClasses<T>(
  color: CustomColor,
  colorMap: Record<CustomColor, T>,
): T;
export function getCustomColorClasses(color: CustomColor): CustomColorClasses;
export function getCustomColorClasses<T>(
  color: CustomColor,
  colorMap?: Record<CustomColor, T>,
): T | CustomColorClasses {
  if (colorMap) {
    return colorMap[color] || colorMap.neutral;
  }
  return colorStyleMap[color] || colorStyleMap.neutral;
}
