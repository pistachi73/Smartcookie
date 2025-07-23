import { Header } from "react-aria-components";

import { cn } from "@/shared/lib/classes";

import { useSidebar } from "./sidebar-provider";

export const SidebarSection = ({
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) => {
  const { state } = useSidebar();
  return (
    <div
      data-sidebar-section="true"
      className={cn("flex flex-col gap-y-1 px-2", className)}
      {...props}
    >
      {state !== "collapsed" && "title" in props && (
        <Header className="uppercase  mb-1 flex shrink-0 items-center rounded-md px-3 font-medium text-muted-fg text-xs outline-none">
          {props.title}
        </Header>
      )}
      <div className="flex flex-col gap-y-0.5">{props.children}</div>
    </div>
  );
};
