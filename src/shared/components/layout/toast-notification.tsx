"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { usePathname } from "@/i18n/navigation";

export enum ToastNotificationError {
  OAUTH_ACCOUNT_NOT_LINKED = "OAuthAccountNotLinked",
  NOT_LOGGED_IN = "NotLoggedIn",
}

const TOAST_NOTIFICATION_ERROR_MAP = new Map<string, string>([
  [
    ToastNotificationError.OAUTH_ACCOUNT_NOT_LINKED,
    "Another account already exists with the same e-mail address.",
  ],
  [
    ToastNotificationError.NOT_LOGGED_IN,
    "You must be logged in to view this content",
  ],
]);

export const ToastNotification = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error && TOAST_NOTIFICATION_ERROR_MAP.get(error)) {
      setTimeout(() => {
        toast.error(TOAST_NOTIFICATION_ERROR_MAP.get(error));
      });
      window.history.replaceState({}, "", pathname);
    }
  }, [error, pathname]);

  return null;
};
