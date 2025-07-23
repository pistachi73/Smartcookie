import { cn } from "@/shared/lib/classes";

import { useSidebar } from "./sidebar-provider";

export const SidebarContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { state } = useSidebar();
  return (
    <div
      data-sidebar-content="true"
      className={cn(
        "flex min-h-0 flex-1 scroll-mb-96 flex-col overflow-auto *:data-sidebar-section:border-l-0",
        state === "collapsed" && "items-center",
        className,
      )}
      {...props}
    />
  );
};
