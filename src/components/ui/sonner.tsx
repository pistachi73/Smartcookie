"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      closeButton
      position="top-center"
      style={{
        fontFamily: "var(--font-sans)",
      }}
      toastOptions={{
        classNames: {
          title: "text-sm",
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-responsive-dark group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-light",
          cancelButton:
            "group-[.toast]:bg-neutral-500/30 group-[.toast]:text-responsive-dark",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
