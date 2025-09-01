"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { Toaster as ToasterPrimitive, type ToasterProps } from "sonner";

import { useTheme } from "@/core/providers/theme-provider";
import { Loader } from "./loader";

const Toast = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();
  return (
    <ToasterPrimitive
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      richColors
      icons={{
        info: (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            data-slot="icon"
            className="text-sky-500"
          />
        ),
        error: (
          <HugeiconsIcon
            icon={Alert02Icon}
            data-slot="icon"
            className="text-danger"
          />
        ),
        warning: (
          <HugeiconsIcon
            icon={AlertCircleIcon}
            data-slot="icon"
            className="text-warning"
          />
        ),
        success: (
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            data-slot="icon"
            className="text-success"
          />
        ),
        loading: <Loader variant="spin" />,
      }}
      toastOptions={{
        className:
          "*:data-icon:self-start font-sans has-data-description:*:data-icon:mt-1 *:data-icon:mt-0.5 backdrop-blur-2xl font-sans",
      }}
      style={
        {
          "--normal-bg": "var(--color-overlay)",
          "--normal-text": "var(--color-overlay-fg)",
          "--normal-border": "var(--color-border)",

          "--success-bg": "var(--color-success-bg)",
          "--success-border": "var(--color-success-border)",
          "--success-text": "var(--color-success-text)",

          "--error-bg": "var(--color-error-bg)",
          "--error-border": "var(--color-error-border)",
          "--error-text": "var(--color-error-text)",

          "--warning-bg": "var(--color-warning-bg)",
          "--warning-border": "var(--color-warning-border)",
          "--warning-text": "var(--color-warning-text)",

          "--info-bg": "var(--color-info-bg)",
          "--info-border": "var(--color-info-border)",
          "--info-text": "var(--color-info-text)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export type { ToasterProps };
export { Toast };
