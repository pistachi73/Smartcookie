import type { PropsWithChildren } from "react";

import { type DeviceType, useDeviceType } from "./device-only-provider";

type Props = {
  allowedDevices: DeviceType | DeviceType[];
};

export const DeviceOnly = ({
  children,
  allowedDevices,
}: PropsWithChildren<Props>) => {
  const { deviceType } = useDeviceType();

  return (Array.isArray(allowedDevices) &&
    allowedDevices.includes(deviceType)) ||
    allowedDevices === deviceType ? (
    <>{children}</>
  ) : null;
};
