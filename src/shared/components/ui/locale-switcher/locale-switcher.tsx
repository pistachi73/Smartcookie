"use client";

import { useParams } from "next/navigation";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Select } from "../select";
import { LocaleSwitcherTrigger } from "./locale-switcher-trigger";

export const LocaleSwitcherSelect = (
  props: React.ComponentProps<typeof LocaleSwitcherTrigger>,
) => {
  const router = useRouter();
  const [_, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  function onSelectChange(locale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: locale.replace("_", "-") },
      );
    });
  }

  return (
    <Select
      onSelectionChange={(v) => {
        if (!v) return;
        onSelectChange(v as Locale);
      }}
      selectedKey={locale.replace("-", "_")}
      className={"w-fit"}
    >
      <LocaleSwitcherTrigger {...props} />
      <Select.List
        items={routing.locales.map((locale) => ({
          locale: locale.replace("-", "_"),
        }))}
      >
        {({ locale }) => (
          <Select.Option id={locale}>{t("locale", { locale })}</Select.Option>
        )}
      </Select.List>
    </Select>
  );
};
