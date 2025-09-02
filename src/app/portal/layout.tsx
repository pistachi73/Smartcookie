import { redirect } from "next/navigation";

import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import { DynamicPortalNav } from "@/shared/components/layout/portal-nav/dynamic-portal-nav";
import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { getHeaders } from "@/shared/lib/get-headers";

import { PortalProviders } from "@/core/providers/portal-providers";
import { QuickNotesMenu } from "@/features/quick-notes/components/quick-notes-menu";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();

  if (!headers.portalEnabled) {
    redirect("/");
  }

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
