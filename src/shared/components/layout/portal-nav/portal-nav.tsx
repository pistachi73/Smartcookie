"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  Diamond02Icon,
  Search01Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { Notification01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useEffect, useState } from "react";

import { Breadcrumbs } from "@/ui/breadcrumbs";
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

export interface PortalNavProps {
  className?: string;
  showSearchField?: boolean;
  breadcrumbs: (
    | { label: string; href: string; icon?: typeof ArrowLeft02Icon }
    | "skeleton"
  )[];
}

export const PortalNav = ({
  className,
  showSearchField = true,
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
        <div className="flex items-center gap-x-4 flex-shrink-0">
          <Breadcrumbs className="@2xl:flex hidden">
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
            {breadcrumbs.map((crumb) => {
              if (crumb === "skeleton") {
                return (
                  <Breadcrumbs.Item
                    key={crumb}
                    className="flex items-center gap-x-2 w-20 h-6"
                  >
                    <Skeleton className="w-24 h-5" />
                  </Breadcrumbs.Item>
                );
              }

              return (
                <Breadcrumbs.Item
                  key={crumb.href}
                  {...crumb}
                  className="flex items-center gap-x-2"
                >
                  {crumb.icon && (
                    <HugeiconsIcon
                      icon={crumb.icon}
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

        <div className="flex items-center gap-x-3">
          {showSearchField && (
            <div className="hidden md:block">
              <FieldGroup className="pl-3 pr-2 w-[400px]">
                <HugeiconsIcon
                  icon={Search01Icon}
                  data-slot="icon"
                  size={14}
                  className="inline text-muted-fg"
                />
                <Input placeholder="Search..." className="text-sm w-full" />
                <Keyboard
                  keys="⌘+K"
                  className={{
                    kbd: "text-sm text-muted-fg",
                  }}
                />
              </FieldGroup>
            </div>
          )}
          <Button
            intent="outline"
            size="square-petite"
            shape="square"
            className="size-10"
          >
            <HugeiconsIcon icon={Notification01Icon} size={16} />
          </Button>

          {!user?.hasActiveSubscription && (
            <ExplorePremiumModal>
              <Button className="shrink-0">
                Explore premium
                <HugeiconsIcon
                  icon={Diamond02Icon}
                  size={16}
                  data-slot="icon"
                />
              </Button>
            </ExplorePremiumModal>
          )}
          {user && <UserButton user={user} />}
        </div>
      </div>
    </SidebarNav>
  );
};
