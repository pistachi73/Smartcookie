"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const TOAST_NOTIFICATION_ERROR_MAP = new Map<string, string>([
  [
    "OAuthAccountNotLinked",
    "Another account already exists with the same e-mail address.",
  ],
]);

export const ToastNotification = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const error = searchParams.get("error");

  useEffect(() => {
    console.log("error", error, TOAST_NOTIFICATION_ERROR_MAP.get(error ?? ""));
    if (error && TOAST_NOTIFICATION_ERROR_MAP.get(error)) {
      setTimeout(() => {
        toast.error(TOAST_NOTIFICATION_ERROR_MAP.get(error));
      });
      window.history.replaceState({}, "", pathname);
    }
  }, [error, pathname]);

  return null;
};
