import { cookies } from "next/headers";
import { use } from "react";

import { SidebarProvider } from "@/shared/components/ui/sidebar/sidebar-provider";

import { OptimizedCalendarProvider } from "@/features/calendar/providers/optimized-calendar-provider";

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
    <SidebarProvider defaultOpen={defaultOpen}>
      <OptimizedCalendarProvider>{children}</OptimizedCalendarProvider>
    </SidebarProvider>
  );
};
