"use client";

import { InformationCircleIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      closeButton
      style={{
        fontFamily: "var(--font-sans)",
      }}
      icons={{
        info: <InformationCircleIcon size={14} />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          title: "text-sm",
          toast:
            "h-auto flex gap-1 items-start justify-start bg-red-200 group toast bg-gradient-to-b from-60% from-elevated-highlight to-elevated border border-border shadow-lg w-full rounded-xl p-3",
          description: "text-text-sub! text-xs",
          content: "flex flex-col gap-1!",
          closeButton:
            "bg-transparent! text-text-sub! hover:text-text-default! transition-colors! border-0! right-1! left-auto! top-1! transform-none!",
          icon: "h-[21px]! flex items-center! justify-center! shrink-0 m-0!",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
