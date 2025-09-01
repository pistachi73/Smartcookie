import { redirect } from "next/navigation";

import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { currentUser } from "@/shared/lib/auth";
import { getHeaders } from "@/shared/lib/get-headers";

import { PortalProviders } from "@/core/providers/portal-providers";
import { QuickNotesMenu } from "@/features/quick-notes/components/quick-notes-menu";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();
  const user = await currentUser();

  if (!headers.portalEnabled) {
    redirect("/");
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <PortalProviders>
      <AppSidebar collapsible="dock" closeButton={true} user={user} />
      <SidebarInset className="h-full min-h-0 flex-col">
        {children}
      </SidebarInset>
      <QuickNotesMenu />
    </PortalProviders>
  );
}
