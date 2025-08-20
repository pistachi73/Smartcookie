"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons-pro/core-solid-rounded";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { useIsMounted } from "@/shared/hooks/use-is-mounted";

import { Button } from "./button";

export function ThemeSwitcher({
  intent = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const isMounted = useIsMounted();
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  if (!isMounted()) {
    return null;
  }

  return (
    <Button
      intent={intent}
      size="sq-sm"
      aria-label="Switch theme"
      onPress={toggleTheme}
      className={className}
      {...props}
    >
      {theme === "light" ? (
        <HugeiconsIcon icon={Sun03Icon} size={18} />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} size={18} />
      )}
    </Button>
  );
}
