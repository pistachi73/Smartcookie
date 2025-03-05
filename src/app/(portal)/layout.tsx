import { PortalHeader } from "@/components/portal/header";
import { SideBar } from "@/components/portal/side-bar";
import { currentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      className={cn(
        "[--panel-gap:calc(var(--spacing)*2)]",
        "[--left-sidebar-width:calc(var(--spacing)*16)]",
        "[--header-height:calc(var(--spacing)*12)]",
        "w-full h-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-2 min-h-full p-[var(--panel-gap)] bg-background"
      )}
      style={{
        gridTemplateAreas: `
          "global-nav global-nav"
          "left-sidebar main-view"
        `,
      }}
    >
      <PortalHeader className='min-h-0 [grid-area:global-nav] h-[calc(var(--header-height)]' />
      <SideBar className='min-h-0 [grid-area:left-sidebar] w-[var(--left-sidebar-width)]' />
      <div className='min-h-0 [grid-area:main-view] overflow-hidden'>{children}</div>
    </div>
  );
}
