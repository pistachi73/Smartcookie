import { Bars } from "./bars";
import { Spin } from "./spin";

export const LOADERS = {
  bars: Bars,
  spin: Spin,
} as const;

export const DEFAULT_SPINNER = "spin" as const;

export type LoaderVariant = keyof typeof LOADERS;
