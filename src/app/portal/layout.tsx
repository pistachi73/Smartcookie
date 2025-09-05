import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import { DynamicPortalNav } from "@/shared/components/layout/portal-nav/dynamic-portal-nav";
import AppSidebar from "@/shared/components/layout/portal-sidebar";

import { PortalProviders } from "@/core/providers/portal-providers";
import { QuickNotesMenu } from "@/features/quick-notes/components/quick-notes-menu";

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
      <QuickNotesMenu />
    </PortalProviders>
  );
}
