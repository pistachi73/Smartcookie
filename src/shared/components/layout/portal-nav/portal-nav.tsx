"use client";

import { Breadcrumbs } from "@/ui/breadcrumbs";
import { Separator } from "@/ui/separator";

import { UserButton } from "@/features/auth/components/user-button";
import { cn } from "@/shared/lib/classes";
import { SearchField } from "../../ui/search-field";
import { SidebarTrigger } from "../../ui/sidebar";

export interface PortalNavProps {
  className?: string;
  showSearchField?: boolean;
  actions?: React.ReactNode;
  breadcrumbs: { label: string; href: string }[];
}

export const PortalNav = ({
  className,
  showSearchField = true,
  actions,
  breadcrumbs,
}: PortalNavProps) => {
  return (
    <nav
      className={cn(
        "border-b h-14 sticky shrink-0 top-0 z-20 bg-background",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full h-full px-2">
        <div className="flex items-center gap-x-4 flex-shrink-0">
          <SidebarTrigger className="-mx-2" appearance="plain" shape="square" />
          <Separator className="h-6" orientation="vertical" />
          <Breadcrumbs className="@md:flex hidden">
            {breadcrumbs.map((crumb) => (
              <Breadcrumbs.Item key={crumb.href} {...crumb}>
                {crumb.label}
              </Breadcrumbs.Item>
            ))}
          </Breadcrumbs>
        </div>

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

        <div className="flex items-center gap-x-2 flex-shrink-0">
          {actions}
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
