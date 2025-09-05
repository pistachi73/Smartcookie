"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Diamond02Icon,
  Search01Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { Notification01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/shared/components/ui/breadcrumbs";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { cn } from "@/shared/lib/classes";

import { UserButton } from "@/features/auth/components/user-button";
import { ExplorePremiumModal } from "../../explore-premium-modal";
import { Button } from "../../ui/button";
import { FieldGroup, Input } from "../../ui/field";
import { Keyboard } from "../../ui/keyboard";
import { SidebarNav } from "../../ui/sidebar";
import { SidebarTrigger } from "../../ui/sidebar/sidebar-trigger";
import { Skeleton } from "../../ui/skeleton";
import { useViewport } from "../viewport-context/viewport-context";
import type { BreadcrumbConfig } from "./breadcrumb-config";

export interface PortalNavProps {
  className?: string;
  showSearchField?: boolean;
  breadcrumbs: BreadcrumbConfig[];
}

export const PortalNav = ({
  className,
  showSearchField = false,
  breadcrumbs,
}: PortalNavProps) => {
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const { down } = useViewport();
  const isMobile = down("md");
  const user = useCurrentUser();

  useEffect(() => {
    setLastUrl(document.referrer);
  }, []);

  return (
    <SidebarNav
      className={cn(
        "border-b h-14 sticky shrink-0 top-0 z-20 bg-overlay",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full h-full gap-8">
        {isMobile && <SidebarTrigger />}
        <div className="flex items-center gap-x-4 shrink-0">
          <Breadcrumbs className="@4xl:flex hidden">
            <Breadcrumbs.Item
              key="back"
              href={lastUrl || "#"}
              separator="slash"
            >
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                data-slot="icon"
                size={16}
              />
            </Breadcrumbs.Item>
            {breadcrumbs.map((crumb, index) => {
              if (crumb === "skeleton") {
                return (
                  <Breadcrumbs.Item
                    key={`breacrumbs-skeleton-${index}`}
                    className="flex items-center gap-x-2 w-18 h-6"
                  >
                    <Skeleton className="w-full h-4 rounded-sm" />
                  </Breadcrumbs.Item>
                );
              }

              const isLastCrumb = crumb === breadcrumbs[breadcrumbs.length - 1];
              const Icon = isLastCrumb ? crumb.iconSolid : crumb.icon;

              return (
                <Breadcrumbs.Item
                  key={crumb.label}
                  {...crumb}
                  className="flex items-center gap-x-2"
                >
                  {Icon && (
                    <HugeiconsIcon
                      icon={Icon}
                      data-slot="icon"
                      size={16}
                      className="inline"
                    />
                  )}
                  {crumb.label}
                </Breadcrumbs.Item>
              );
            })}
          </Breadcrumbs>
        </div>

        <div className="flex items-center  gap-x-2 sm:gap-x-3 shrink-0">
          {showSearchField && (
            <div className="hidden md:block">
              <FieldGroup className="pl-3 pr-2 w-[400px]">
                <HugeiconsIcon
                  icon={Search01Icon}
                  data-slot="icon"
                  className="inline text-muted-fg"
                />
                <Input placeholder="Search..." className="text-sm w-full" />
                <Keyboard keys="⌘+K" />
              </FieldGroup>
            </div>
          )}
          <Button intent="outline" size="sq-md" className="size-9 sm:size-10">
            <HugeiconsIcon icon={Notification01Icon} size={16} />
          </Button>

          {!user?.hasActiveSubscription && (
            <ExplorePremiumModal>
              <Button
                className={cn("shrink-0")}
                size={isMobile ? "sq-md" : "md"}
              >
                <HugeiconsIcon icon={Diamond02Icon} data-slot="icon" />
                {isMobile ? "" : "Explore premium"}
              </Button>
            </ExplorePremiumModal>
          )}
          {user && <UserButton user={user} />}
        </div>
      </div>
    </SidebarNav>
  );
};
