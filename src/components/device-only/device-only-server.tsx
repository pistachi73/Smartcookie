import { VERCEL_HEADERS } from "@/app-config";
import { headers } from "next/headers";
import type { DeviceType } from "./device-only-provider";

type SSRProps = {
  children: React.ReactNode;
  allowedDevices: DeviceType | DeviceType[];
};

const DeviceOnlyServerComponent = async ({
  children,
  allowedDevices,
}: SSRProps) => {
  const deviceType = (await headers()).get(
    VERCEL_HEADERS.DEVICE_TYPE,
  ) as DeviceType;
  return (Array.isArray(allowedDevices) &&
    allowedDevices.includes(deviceType)) ||
    allowedDevices === deviceType
    ? children
    : null;
};

export default DeviceOnlyServerComponent;
