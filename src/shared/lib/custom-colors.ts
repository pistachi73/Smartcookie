import type { Hub } from "@/db/schema";

export type CustomColor = Hub["color"];

export interface CustomColorClasses {
  bg: string;
  border: string;
  text: string;
  dot: string;
  focusVisible: string;
  ring: string;
}

/**
 * Maps custom color enum values to Tailwind classes
 * Uses the custom color variables from globals.css with optimized opacity and contrast
 * Text colors use existing color variables from globals.css for consistency
 */
export const colorStyleMap: Record<CustomColor, CustomColorClasses> = {
  flamingo: {
    bg: "bg-[var(--custom-flamingo-bg)]/75",
    border: "border-[var(--custom-flamingo-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-flamingo-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-flamingo-border)]",
    ring: "ring-[var(--custom-flamingo-border)]/20",
  },
  tangerine: {
    bg: "bg-[var(--custom-tangerine-bg)]/75",
    border: "border-[var(--custom-tangerine-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-tangerine-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-tangerine-border)]",
    ring: "ring-[var(--custom-tangerine-border)]/20",
  },
  banana: {
    bg: "bg-[var(--custom-banana-bg)]/75",
    border: "border-[var(--custom-banana-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-banana-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-banana-border)]",
    ring: "ring-[var(--custom-banana-border)]/20",
  },
  sage: {
    bg: "bg-[var(--custom-sage-bg)]/75",
    border: "border-[var(--custom-sage-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-sage-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-sage-border)]",
    ring: "ring-[var(--custom-sage-border)]/20",
  },
  peacock: {
    bg: "bg-[var(--custom-peacock-bg)]/75",
    border: "border-[var(--custom-peacock-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-peacock-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-peacock-border)]",
    ring: "ring-[var(--custom-peacock-border)]/20",
  },
  blueberry: {
    bg: "bg-[var(--custom-blueberry-bg)]/75",
    border: "border-[var(--custom-blueberry-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-blueberry-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-blueberry-border)]",
    ring: "ring-[var(--custom-blueberry-border)]/20",
  },
  lavender: {
    bg: "bg-[var(--custom-lavender-bg)]/75",
    border: "border-[var(--custom-lavender-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-lavender-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-lavender-border)]",
    ring: "ring-[var(--custom-lavender-border)]/20",
  },
  grape: {
    bg: "bg-[var(--custom-grape-bg)]/75",
    border: "border-[var(--custom-grape-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-grape-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-grape-border)]",
    ring: "ring-[var(--custom-grape-border)]/20",
  },
  graphite: {
    bg: "bg-[var(--custom-graphite-bg)]/75",
    border: "border-[var(--custom-graphite-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-graphite-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-graphite-border)]",
    ring: "ring-[var(--custom-graphite-border)]/20",
  },
  neutral: {
    bg: "bg-[var(--custom-neutral-bg)]/75",
    border: "border-[var(--custom-neutral-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-neutral-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-neutral-border)]",
    ring: "ring-[var(--custom-neutral-border)]/20",
  },
  sunshine: {
    bg: "bg-[var(--custom-sunshine-bg)]/75",
    border: "border-[var(--custom-sunshine-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-sunshine-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-sunshine-border)]",
    ring: "ring-[var(--custom-sunshine-border)]/20",
  },
  stone: {
    bg: "bg-[var(--custom-stone-bg)]/75",
    border: "border-[var(--custom-stone-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-stone-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-stone-border)]",
    ring: "ring-[var(--custom-stone-border)]/20",
  },
  slate: {
    bg: "bg-[var(--custom-slate-bg)]/75",
    border: "border-[var(--custom-slate-border)]",
    text: "text-fg dark:text-fg",
    dot: "bg-[var(--custom-slate-bg)]/90",
    focusVisible: "focus-visible:ring-[var(--custom-slate-border)]",
    ring: "ring-[var(--custom-slate-border)]/20",
  },
};

export const hubCardColorStyleMap: Record<
  CustomColor,
  { hover: string; dot: string }
> = {
  flamingo: {
    hover: "hover:border-[var(--custom-flamingo-border)]",
    dot: "bg-[var(--custom-flamingo-bg)]",
  },
  tangerine: {
    hover: "hover:border-[var(--custom-tangerine-border)]",
    dot: "bg-[var(--custom-tangerine-bg)]",
  },
  banana: {
    hover: "hover:border-[var(--custom-banana-border)]",
    dot: "bg-[var(--custom-banana-bg)]",
  },
  sage: {
    hover: "hover:border-[var(--custom-sage-border)]",
    dot: "bg-[var(--custom-sage-bg)]",
  },
  peacock: {
    hover: "hover:border-[var(--custom-peacock-border)]",
    dot: "bg-[var(--custom-peacock-bg)]",
  },
  blueberry: {
    hover: "hover:border-[var(--custom-blueberry-border)]",
    dot: "bg-[var(--custom-blueberry-bg)]",
  },
  lavender: {
    hover: "hover:border-[var(--custom-lavender-border)]",
    dot: "bg-[var(--custom-lavender-bg)]",
  },
  grape: {
    hover: "hover:border-[var(--custom-grape-border)]",
    dot: "bg-[var(--custom-grape-bg)]",
  },
  graphite: {
    hover: "hover:border-[var(--custom-graphite-border)]",
    dot: "bg-[var(--custom-graphite-bg)]",
  },
  neutral: {
    hover: "hover:border-[var(--custom-neutral-border)]",
    dot: "bg-[var(--custom-neutral-bg)]",
  },
  sunshine: {
    hover: "hover:border-[var(--custom-sunshine-border)]",
    dot: "bg-[var(--custom-sunshine-bg)]",
  },
  stone: {
    hover: "hover:border-[var(--custom-stone-border)]",
    dot: "bg-[var(--custom-stone-bg)]",
  },
  slate: {
    hover: "hover:border-[var(--custom-slate-border)]",
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
