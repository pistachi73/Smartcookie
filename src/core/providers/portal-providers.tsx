import { SidebarProvider } from "@/shared/components/ui/sidebar/sidebar-provider";
import { cookies } from "next/headers";
import { use } from "react";

export const PortalProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const cookieStore = use(cookies());
  let defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  if (cookieStore.get("sidebar:state")?.value === undefined) {
    defaultOpen = false;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
  );
};
