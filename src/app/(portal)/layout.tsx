import { PortalHeader } from "@/components/portal/header";
import { SideBar } from "@/components/portal/side-bar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex grow h-full min-h-screen">
      <SideBar />
      <div className="grow flex flex-col pr-4">
        <PortalHeader />
        {children}
      </div>
    </div>
  );
  // return (
  //   <div className="flex h-full w-full flex-col items-center gap-4 min-h-screen">
  //     {/* <PortalHeader /> */}
  //     <div className="w-full flex gap-6 px-6 pr-4 grow">
  //       <SideBar />
  //       {children}
  //     </div>
  //   </div>
  // );
}
