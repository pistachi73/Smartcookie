import { VERCEL_HEADERS } from "@/app-config";
import type { DeviceType } from "@/components/device-only/device-only-provider";
import { headers } from "next/headers";

export const getHeaders = async () => {
  const parsedHeaders = await headers();
  const countryCode = parsedHeaders.get(VERCEL_HEADERS.COUNTRY) as string;
  const deviceType = parsedHeaders.get(
    VERCEL_HEADERS.DEVICE_TYPE,
  ) as DeviceType;
  const authorization =
    parsedHeaders.get("authorization") || parsedHeaders.get("Authorization");

  return {
    countryCode,
    deviceType,
    authorization,
  };
};
