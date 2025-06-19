import { PortalProviders } from "@/core/providers/portal-providers";
import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import { currentUser } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export default async function PortalLayout({
  children,
}: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <PortalProviders>
      <AppSidebar collapsible="dock" />
      <SidebarInset className="h-full min-h-0 flex-col">
        {children}
      </SidebarInset>
    </PortalProviders>
  );
}
