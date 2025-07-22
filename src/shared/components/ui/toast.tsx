"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { useTheme } from "next-themes";
import { Toaster as ToasterPrimitive, type ToasterProps } from "sonner";

import { cn } from "@/shared/lib/classes";

import { buttonStyles } from "./button";
import { Loader } from "./loader";

const Toast = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  return (
    <ToasterPrimitive
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-left"
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
        unstyled: true,
        closeButton: true,
        classNames: {
          toast: cn(
            "text-[0.925rem] not-has-data-description:**:data-title:font-normal!",
            "has-data-description:**:data-title:font-medium [&:has([data-description])_[data-title]]:text-sm!",
            "has-data-[slot=icon]:**:data-content:pl-0",
            "has-data-button:**:data-close-button:hidden! flex w-full rounded-xl p-4",
            "inset-ring-1 inset-ring-current/10 backdrop-blur-3xl",
          ),
          icon: "absolute top-[0.2rem] [--toast-icon-margin-end:7px] *:data-[slot=icon]:text-fg *:data-[slot=icon]:size-4.5 **:data-[slot=icon]:text-current",
          title: "",
          description: "",
          default: "bg-bg text-fg [--gray2:theme(--color-fg/10%)]",
          content:
            "pr-6 *:data-description:text-current/65! *:data-description:text-sm!",
          error:
            "inset-ring-danger/15 dark:inset-ring-danger/25 [--error-bg:theme(--color-danger/10%)] [--error-border:transparent] [--error-text:var(--color-danger)]",
          info: "inset-ring-sky-600/15 dark:inset-ring-sky-500/20 [--info-border:transparent] [--info-bg:theme(--color-sky-500/10%)] [--info-text:var(--color-sky-700)] dark:[--info-bg:theme(--color-sky-500/15%)] dark:[--info-text:var(--color-sky-400)]",
          warning:
            "inset-ring-warning/30 dark:inset-ring-warning/15 [--warning-bg:theme(--color-warning/20%)] dark:[--warning-bg:theme(--color-warning/10%)] [--warning-border:transparent] [--warning-text:var(--color-warning-fg)] dark:[--warning-text:var(--color-warning)]",
          success:
            "inset-ring-success/20 [--success-bg:theme(--color-success/80%)] dark:[--success-bg:theme(--color-success/20%)] [--success-border:transparent] [--success-text:#fff] dark:[--success-text:var(--color-success)]",
          cancelButton: buttonStyles({
            className:
              "hover:border-secondary-fg/10 hover:bg-secondary/90 self-start absolute bottom-4 left-4 justify-self-start",
            size: "extra-small",
            intent: "outline",
          }),
          actionButton: buttonStyles({
            size: "extra-small",
            intent: "plain",
          }),
          closeButton:
            "*:[svg]:size-12 size-6! rounded-md! [--gray1:transparent] [--gray4:transparent] [--gray5:transparent] [--gray12:current] [--toast-close-button-start:full] [--toast-close-button-end:-6px] [--toast-close-button-transform:translate(-75%,60%)] absolute",
        },
      }}
      {...props}
    />
  );
};

export { Toast };
export type { ToasterProps };
