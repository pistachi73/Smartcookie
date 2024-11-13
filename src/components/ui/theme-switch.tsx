"use client";

import { Moon01Icon, Sun02Icon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

export default function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      orientation="vertical"
      onValueChange={(value) => {
        setTheme(value);
      }}
    >
      <ToggleGroupItem
        value="light"
        size={"lg"}
        iconOnly
        className="bg-background-reverse text-light dark:bg-background"
      >
        <Sun02Icon size={20} variant={"stroke"} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        size={"lg"}
        iconOnly
        className="bg-background text-dark dark:bg-background-reverse"
      >
        <Moon01Icon size={20} variant={"stroke"} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
