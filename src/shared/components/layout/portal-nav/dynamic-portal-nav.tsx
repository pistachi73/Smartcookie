"use client";

import { usePathname } from "next/navigation";

import { getBreadcrumbsForPath } from "./breadcrumb-config";
import { PortalNav } from "./portal-nav";

export function DynamicPortalNav({
  className,
  showSearchField = true,
}: {
  className?: string;
  showSearchField?: boolean;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbsForPath(pathname);

  return (
    <PortalNav
      className={className}
      showSearchField={showSearchField}
      breadcrumbs={
        breadcrumbs.length > 0 ? breadcrumbs : ["skeleton", "skeleton"]
      }
    />
  );
}
