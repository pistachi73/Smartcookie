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
    bg: "bg-[var(--custom-flamingo-bg-tint)]",
    border: "border-[var(--custom-flamingo-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-flamingo-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-flamingo-bg-shade)]",
    ring: "ring-[var(--custom-flamingo-bg-shade)]",
  },
  tangerine: {
    bg: "bg-[var(--custom-tangerine-bg-tint)]",
    border: "border-[var(--custom-tangerine-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-tangerine-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-tangerine-bg-shade)]",
    ring: "ring-[var(--custom-tangerine-bg-shade)]",
  },
  banana: {
    bg: "bg-[var(--custom-banana-bg-tint)]",
    border: "border-[var(--custom-banana-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-banana-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-banana-bg-shade)]",
    ring: "ring-[var(--custom-banana-bg-shade)]",
  },
  sage: {
    bg: "bg-[var(--custom-sage-bg-tint)]",
    border: "border-[var(--custom-sage-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-sage-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-sage-bg-shade)]",
    ring: "ring-[var(--custom-sage-bg-shade)]",
  },
  peacock: {
    bg: "bg-[var(--custom-peacock-bg-tint)]",
    border: "border-[var(--custom-peacock-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-peacock-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-peacock-bg-shade)]",
    ring: "ring-[var(--custom-peacock-bg-shade)]",
  },
  blueberry: {
    bg: "bg-[var(--custom-blueberry-bg-tint)]",
    border: "border-[var(--custom-blueberry-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-blueberry-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-blueberry-bg-shade)]",
    ring: "ring-[var(--custom-blueberry-bg-shade)]",
  },
  lavender: {
    bg: "bg-[var(--custom-lavender-bg-tint)]",
    border: "border-[var(--custom-lavender-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-lavender-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-lavender-bg-shade)]",
    ring: "ring-[var(--custom-lavender-bg-shade)]",
  },
  grape: {
    bg: "bg-[var(--custom-grape-bg-tint)]",
    border: "border-[var(--custom-grape-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-grape-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-grape-bg-shade)]",
    ring: "ring-[var(--custom-grape-bg-shade)]",
  },
  graphite: {
    bg: "bg-[var(--custom-graphite-bg-tint)]",
    border: "border-[var(--custom-graphite-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-graphite-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-graphite-bg-shade)]",
    ring: "ring-[var(--custom-graphite-bg-shade)]",
  },
  neutral: {
    bg: "bg-[var(--custom-neutral-bg-tint)]",
    border: "border-[var(--custom-neutral-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-neutral-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-neutral-bg-shade)]",
    ring: "ring-[var(--custom-neutral-bg-shade)]",
  },
  sunshine: {
    bg: "bg-[var(--custom-sunshine-bg-tint)]",
    border: "border-[var(--custom-sunshine-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-sunshine-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-sunshine-bg-shade)]",
    ring: "ring-[var(--custom-sunshine-bg-shade)]",
  },
  stone: {
    bg: "bg-[var(--custom-stone-bg-tint)]",
    border: "border-[var(--custom-stone-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-stone-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-stone-bg-shade)]",
    ring: "ring-[var(--custom-stone-bg-shade)]",
  },
  slate: {
    bg: "bg-[var(--custom-slate-bg-tint)]",
    border: "border-[var(--custom-slate-bg-shade)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-slate-bg)]",
    focusVisible: "focus-visible:ring-[var(--custom-slate-bg-shade)]",
    ring: "ring-[var(--custom-slate-bg-shade)]",
  },
};

export const hubCardColorStyleMap: Record<
  CustomColor,
  { hover: string; dot: string }
> = {
  flamingo: {
    hover: "hover:border-[var(--custom-flamingo-bg-shade)]",
    dot: "bg-[var(--custom-flamingo-bg)]",
  },
  tangerine: {
    hover: "hover:border-[var(--custom-tangerine-bg-shade)]",
    dot: "bg-[var(--custom-tangerine-bg)]",
  },
  banana: {
    hover: "hover:border-[var(--custom-banana-bg-shade)]",
    dot: "bg-[var(--custom-banana-bg)]",
  },
  sage: {
    hover: "hover:border-[var(--custom-sage-bg-shade)]",
    dot: "bg-[var(--custom-sage-bg)]",
  },
  peacock: {
    hover: "hover:border-[var(--custom-peacock-bg-shade)]",
    dot: "bg-[var(--custom-peacock-bg)]",
  },
  blueberry: {
    hover: "hover:border-[var(--custom-blueberry-bg-shade)]",
    dot: "bg-[var(--custom-blueberry-bg)]",
  },
  lavender: {
    hover: "hover:border-[var(--custom-lavender-bg-shade)]",
    dot: "bg-[var(--custom-lavender-bg)]",
  },
  grape: {
    hover: "hover:border-[var(--custom-grape-bg-shade)]",
    dot: "bg-[var(--custom-grape-bg)]",
  },
  graphite: {
    hover: "hover:border-[var(--custom-graphite-bg-shade)]",
    dot: "bg-[var(--custom-graphite-bg)]",
  },
  neutral: {
    hover: "hover:border-[var(--custom-neutral-bg-shade)]",
    dot: "bg-[var(--custom-neutral-bg)]",
  },
  sunshine: {
    hover: "hover:border-[var(--custom-sunshine-bg-shade)]",
    dot: "bg-[var(--custom-sunshine-bg)]",
  },
  stone: {
    hover: "hover:border-[var(--custom-stone-bg-shade)]",
    dot: "bg-[var(--custom-stone-bg)]",
  },
  slate: {
    hover: "hover:border-[var(--custom-slate-bg-shade)]",
    dot: "bg-[var(--custom-slate-bg)]",
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
