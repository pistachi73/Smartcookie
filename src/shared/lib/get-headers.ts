import { VERCEL_HEADERS } from "@/core/config/app-config";
import type { DeviceType } from "@/shared/components/layout/device-only/device-only-provider";
import { headers } from "next/headers";

export const getHeaders = async () => {
  const parsedHeaders = await headers();
  const deviceType = parsedHeaders.get(
    VERCEL_HEADERS.DEVICE_TYPE,
  ) as DeviceType;
  const authorization =
    parsedHeaders.get("authorization") || parsedHeaders.get("Authorization");

  return {
    deviceType,
    authorization,
  };
};
