import { headers } from "next/headers";

import { VERCEL_HEADERS } from "@/core/config/app-config";
import type { DeviceType } from "../components/layout/viewport-context/types";

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
