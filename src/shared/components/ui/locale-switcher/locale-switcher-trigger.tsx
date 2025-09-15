import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Globe02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/shared/components/ui/button";

export const LocaleSwitcherTrigger = ({
  children,
  ...props
}: ButtonProps & { children?: ReactNode }) => {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  return (
    <Button {...props} className={"gap-2 w-fit"}>
      <HugeiconsIcon icon={Globe02Icon} data-slot="icon" />
      <span className="capitalize">
        {t("locale", { locale: locale.replace("-", "_") })}
      </span>

      <HugeiconsIcon
        icon={ArrowDown01Icon}
        data-slot="icon"
        className="size-4 shrink-0 text-muted-fg duration-300 group-data-expanded:rotate-180 group-data-open:text-fg"
      />
    </Button>
  );
};
