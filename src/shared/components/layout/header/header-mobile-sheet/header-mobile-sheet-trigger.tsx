import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/classes";

export const buttonCustomStyles =
  "relative sm:text-base shrink-0 tracking-tight hover:bg-fg/90 pressed:bg-fg/80 hover:text-bg cursor-pointer transition-colors";

export const HeaderMobileSheetTrigger = () => {
  return (
    <Button
      intent="plain"
      size="sq-lg"
      className={({ isPressed }) =>
        cn("p-2", buttonCustomStyles, isPressed && "bg-fg/90 text-white")
      }
    >
      <HugeiconsIcon icon={Menu01Icon} size={20} />
    </Button>
  );
};
