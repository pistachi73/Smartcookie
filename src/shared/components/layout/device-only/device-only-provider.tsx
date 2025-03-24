"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
export type DeviceSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type DeviceType = "mobile" | "tablet" | "desktop";

type CountProviderProps = { children: React.ReactNode; deviceType: DeviceType };

const DeviceTypeContext = createContext<
  | {
      deviceType: DeviceType;
      isMobile: boolean;
      isTablet: boolean;
    }
  | undefined
>(undefined);

export const SCREENS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const MEDIA_QUERIES = {
  SM: `(min-width: ${SCREENS.SM}px)`,
  MD: `(min-width: ${SCREENS.MD}px)`,
  LG: `(min-width: ${SCREENS.LG}px)`,
  XL: `(min-width: ${SCREENS["2XL"]}px)`,
} as const;

const getIsMobileUsingViewport = (
  serverDeviceType: DeviceType,
  viewportWidth: number,
): { deviceType: DeviceType } => {
  const deviceType =
    viewportWidth < SCREENS.SM
      ? "mobile"
      : viewportWidth < SCREENS.LG
        ? "tablet"
        : "desktop";

  const isLandscape = window.matchMedia("(orientation: landscape").matches;

  if (serverDeviceType === "mobile" && isLandscape) {
    return {
      deviceType: "mobile",
    };
  }

  if (serverDeviceType === "tablet" && isLandscape) {
    return {
      deviceType: "tablet",
    };
  }

  return { deviceType };
};

export const DeviceOnlyProvider = ({
  children,
  deviceType: serverDeviceType,
}: CountProviderProps) => {
  const [deviceTypeState, setDeviceType] =
    useState<DeviceType>(serverDeviceType);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth) {
        const { deviceType } = getIsMobileUsingViewport(
          serverDeviceType,
          window.innerWidth,
        );

        setDeviceType(deviceType);
      }
    };

    const { deviceType } = getIsMobileUsingViewport(
      serverDeviceType,
      window.innerWidth,
    );

    setDeviceType(deviceType);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [serverDeviceType]);

  const value = useMemo(
    () => ({
      deviceType: deviceTypeState,
      isMobile: deviceTypeState === "mobile",
      isTablet: deviceTypeState === "tablet",
    }),
    [deviceTypeState],
  );
  return (
    <DeviceTypeContext.Provider value={value}>
      {children}
    </DeviceTypeContext.Provider>
  );
};

export const useDeviceType = () => {
  const context = useContext(DeviceTypeContext);
  if (context === undefined) {
    throw new Error("useDeviceType must be used within a DeviceTypeProvider");
  }
  return context;
};
