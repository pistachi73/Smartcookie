"use client";

import { useIsMounted } from "@/hooks/use-is-mounted";
import { Moon02Icon, Sun03Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Button } from "./";

export function ThemeSwitcher({
  shape = "square",
  appearance = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  const { theme, setTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  return (
    <Button
      shape={shape}
      appearance={appearance}
      size='square-petite'
      aria-label='Switch theme'
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
