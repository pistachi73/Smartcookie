"use client";

import { UserButton } from "@/features/auth/components/user-button";
import {
  Breadcrumbs,
  SearchField,
  Separator,
  SidebarNav,
  SidebarTrigger,
} from "@/shared/components/ui";

import { cn } from "@/shared/lib/classes";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getNavigationPathDetails } from "./navigation-helpers";

export interface PortalNavProps {
  className?: string;
  showSearchField?: boolean;
  actions?: React.ReactNode;
}

export const Test = () => {
  return <div>test</div>;
};

export const PortalNav = ({
  className,
  showSearchField = true,
  actions,
}: PortalNavProps) => {
  const pathname = usePathname();

  // Memoize breadcrumbs calculation to avoid unnecessary recalculations
  const { breadcrumbs } = useMemo(
    () => getNavigationPathDetails(pathname),
    [pathname],
  );

  return (
    <SidebarNav
      className={cn(
        "border-b h-14 sticky shrink-0 top-0 z-20 bg-background",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full h-full px-2">
        {/* Left section with sidebar trigger and breadcrumbs */}
        <div className="flex items-center gap-x-4 flex-shrink-0">
          <SidebarTrigger className="-mx-2" appearance="plain" shape="square" />
          <Separator className="h-6" orientation="vertical" />
          <Breadcrumbs className="@md:flex hidden">
            {breadcrumbs.map((crumb) => (
              <Breadcrumbs.Item
                key={`${pathname}-${crumb.href}`}
                href={crumb.href}
              >
                {crumb.label}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
        </div>

        {/* Middle section with search */}
        {showSearchField && (
          <div className="flex-1 max-w-md mx-4 hidden @md:block">
            <SearchField
              placeholder="Search..."
              className={{
                fieldGroup: "w-full",
              }}
            />
          </div>
        )}

        {/* Right section with actions and user button */}
        <div className="flex items-center gap-x-2 flex-shrink-0">
          {actions}
          <UserButton />
        </div>
      </div>
    </SidebarNav>
  );
};
