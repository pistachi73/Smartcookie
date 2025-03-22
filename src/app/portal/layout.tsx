import AppSidebar from "@/shared/components/layout/portal-sidebar";
import { currentUser } from "@/shared/lib/auth";
import { SidebarInset, SidebarProvider } from "@/ui/sidebar";
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
      <SidebarInset className="h-full flex-col">
        <div className="h-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>

    // <div
    //   className={cn(
    //     "[--panel-gap:calc(var(--spacing)*2)]",
    //     "[--left-sidebar-width:calc(var(--spacing)*16)]",
    //     "[--header-height:calc(var(--spacing)*12)]",
    //     "w-full h-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-2 min-h-full p-[var(--panel-gap)] bg-background"
    //   )}
    //   style={{
    //     gridTemplateAreas: `
    //       "global-nav global-nav"
    //       "left-sidebar main-view"
    //     `,
    //   }}
    // >
    //   <PortalHeader className='min-h-0 [grid-area:global-nav] h-[calc(var(--header-height)]' />
    //   <SideBar className='min-h-0 [grid-area:left-sidebar] w-[var(--left-sidebar-width)]' />
    //   <div className='min-h-0 [grid-area:main-view] overflow-hidden'>{children}</div>
    // </div>
  );
}
