import { redirect } from "next/navigation";

import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { currentUser } from "@/shared/lib/auth";

import { PortalProviders } from "@/core/providers/portal-providers";
import { env } from "@/env";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const isPortalBlocked = env.NEXT_PUBLIC_BLOCK_PORTAL === "true";

  if (isPortalBlocked) {
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
    </PortalProviders>
  );
}
