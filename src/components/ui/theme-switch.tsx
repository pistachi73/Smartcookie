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
      className="rounded-xl border-0 gap-px"
    >
      <ToggleGroupItem
        value="light"
        size={"default"}
        iconOnly
        className="bg-background-reverse text-light dark:bg-transparent rounded-xl"
      >
        <Sun02Icon size={18} strokeWidth={1.5} variant={"stroke"} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        size={"default"}
        iconOnly
        className="bg-transparent text-dark dark:bg-light rounded-xl"
      >
        <Moon01Icon size={18} strokeWidth={1.5} variant={"stroke"} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
