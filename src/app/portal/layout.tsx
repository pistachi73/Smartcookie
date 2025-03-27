import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { SidebarInset } from "@/shared/components/ui/sidebar/index";
import { SidebarProvider } from "@/shared/components/ui/sidebar/sidebar-provider";
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
    <SidebarProvider>
      <AppSidebar collapsible="dock" />
      <SidebarInset className="h-full min-h-0 flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
