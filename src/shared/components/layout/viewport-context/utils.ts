import type { Breakpoint, DeviceType, Viewport } from "./types";

const DEVICES: Record<DeviceType, Viewport> = {
  mobile: "sm",
  tablet: "lg",
  desktop: "xl",
};

const SCREENS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

const VIEWPORTS = Object.keys(SCREENS) as Viewport[];
const BREAKPOINTS = Object.values(SCREENS) as Breakpoint[];

const createViewportHelpers = (currentViewport: Viewport) => {
  const is = (viewport: Viewport) => currentViewport === viewport;

  const up = (viewport: Viewport) => {
    const viewportIndex = VIEWPORTS.findIndex((key) => key === viewport);
    return VIEWPORTS.slice(viewportIndex).includes(currentViewport);
  };

  const down = (viewport: Viewport) => {
    const viewportIndex = VIEWPORTS.findIndex((key) => key === viewport);
    return VIEWPORTS.slice(0, viewportIndex).includes(currentViewport);
  };

  const between = ([from, to]: [Viewport, Viewport]) => {
    const fromIndex = VIEWPORTS.findIndex((key) => key === from);
    const toIndex = VIEWPORTS.findIndex((key) => key === to);

    const breakpointsList =
      fromIndex > toIndex
        ? VIEWPORTS.slice(toIndex, fromIndex + 1)
        : VIEWPORTS.slice(fromIndex, toIndex + 1);

    return breakpointsList.includes(currentViewport);
  };

  return { currentViewport, is, down, up, between };
};

const getMediaQueryString = (breakpoint: Breakpoint) =>
  `(min-width: ${breakpoint}px)`;

// get current viewport based on media query lists
const getCurrentViewport = (mediaQueryLists: MediaQueryList[]) =>
  mediaQueryLists.reduce(
    (currentViewport, mediaQueryList, i) =>
      mediaQueryList.matches ? (VIEWPORTS[i] as Viewport) : currentViewport,
    VIEWPORTS[0] as Viewport,
  );

const getSsrViewport = (deviceType: string) =>
  DEVICES[deviceType as DeviceType] ?? DEVICES.desktop;

export {
  BREAKPOINTS,
  createViewportHelpers,
  DEVICES,
  getCurrentViewport,
  getMediaQueryString,
  getSsrViewport,
  SCREENS,
  VIEWPORTS,
};
