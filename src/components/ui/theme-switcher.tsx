"use client";

import { Moon02Icon, Sun03Icon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { Button } from "./new/ui";

export function ThemeSwitcher({
  shape = "square",
  appearance = "outline",
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <Button
      shape={shape}
      appearance={appearance}
      size="square-petite"
      aria-label="Switch theme"
      onPress={toggleTheme}
      className={className}
      {...props}
    >
      {theme === "light" ? <Sun03Icon size={18} /> : <Moon02Icon size={18} />}
    </Button>
  );
}
