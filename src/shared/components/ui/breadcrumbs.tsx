"use client";

import { cn } from "@/shared/lib/classes";
import {
  ArrowRight01Icon,
  SolidLine01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { createContext, use } from "react";
import type {
  BreadcrumbProps,
  BreadcrumbsProps,
  LinkProps,
} from "react-aria-components";
import {
  Breadcrumb,
  Breadcrumbs as BreadcrumbsPrimitive,
} from "react-aria-components";
import { Link } from "./link";

type BreadcrumbsContextProps = { separator?: "chevron" | "slash" | boolean };
const BreadcrumbsProvider = createContext<BreadcrumbsContextProps>({
  separator: "chevron",
});

const Breadcrumbs = <T extends object>({
  className,
  ...props
}: BreadcrumbsProps<T> & BreadcrumbsContextProps) => {
  return (
    <BreadcrumbsProvider value={{ separator: props.separator }}>
      <BreadcrumbsPrimitive
        {...props}
        className={cn("flex items-center gap-2", className)}
      />
    </BreadcrumbsProvider>
  );
};

interface BreadcrumbsItemProps
  extends BreadcrumbProps,
    BreadcrumbsContextProps {
  href?: string;
}

const BreadcrumbsItem = ({
  href,
  separator = true,
  className,
  ...props
}: BreadcrumbsItemProps & Partial<Omit<LinkProps, "className">>) => {
  const { separator: contextSeparator } = use(BreadcrumbsProvider);
  separator = contextSeparator ?? separator;
  const separatorValue = separator === true ? "chevron" : separator;

  console.log({ props }, props.isDisabled);

  return (
    <Breadcrumb {...props} className={"flex items-center gap-2 text-sm"}>
      {({ isCurrent }) => (
        <>
          <Link
            href={href}
            {...props}
            className={cn(
              isCurrent
                ? "text-fg font-medium opacity-100!"
                : "text-muted-fg hover:text-fg",
              className,
            )}
          />
          {!isCurrent && separator !== false && (
            <Separator separator={separatorValue} />
          )}
        </>
      )}
    </Breadcrumb>
  );
};

const Separator = ({
  separator = "chevron",
}: { separator?: BreadcrumbsItemProps["separator"] }) => {
  return (
    <span className="*:shrink-0 *:text-muted-fg *:data-[slot=icon]:size-3.5">
      {separator === "chevron" && (
        <HugeiconsIcon icon={ArrowRight01Icon} data-slot="icon" />
      )}
      {separator === "slash" && (
        <HugeiconsIcon
          icon={SolidLine01Icon}
          data-slot="icon"
          className="rotate-90"
        />
      )}
    </span>
  );
};

Breadcrumbs.Item = BreadcrumbsItem;

export { Breadcrumbs };
export type { BreadcrumbsItemProps, BreadcrumbsProps };
