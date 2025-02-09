import { SideBar } from "@/components/portal/side-bar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-2 min-h-screen p-2 bg-background"
      style={{
        gridTemplateAreas: `
          "left-sidebar main-view"
          "left-sidebar main-view"
        `,
      }}
    >
      {/* <div className="[grid-area:global-nav]">
        <PortalHeader />
      </div> */}
      <div className="[grid-area:left-sidebar]  ">
        <SideBar />
      </div>
      <div className="[grid-area:main-view]">{children}</div>
    </div>
  );
}
