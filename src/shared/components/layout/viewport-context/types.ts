import type { SCREENS, createViewportHelpers } from "./utils";

type DeviceType = "mobile" | "tablet" | "desktop";

type Screens = typeof SCREENS;

type Viewport = keyof Screens;

type Breakpoint = Screens[Viewport];

type ViewportHelpers = ReturnType<typeof createViewportHelpers>;

export type { Breakpoint, DeviceType, Viewport, ViewportHelpers };
