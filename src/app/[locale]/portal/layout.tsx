import type { Metadata } from "next";

import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import { DynamicPortalNav } from "@/shared/components/layout/portal-nav/dynamic-portal-nav";
import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { currentUser } from "@/shared/lib/auth";

import { PortalProviders } from "@/core/providers/portal-providers";

export const generateMetadata = async (): Promise<Metadata> => {
  const user = await currentUser();

  return {
    title: user?.name,
  };
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalProviders>
      <AppSidebar collapsible="dock" closeButton={true} />
      <SidebarInset className="h-full min-h-0 flex-col">
        <DynamicPortalNav />
        {children}
      </SidebarInset>
    </PortalProviders>
  );
}
