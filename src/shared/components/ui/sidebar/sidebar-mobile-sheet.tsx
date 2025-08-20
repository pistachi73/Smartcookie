import { Sheet } from "../sheet";
import { useSidebar } from "./sidebar-provider";

interface SidebarProps extends React.ComponentProps<"div"> {
  intent?: "default" | "float" | "inset" | "fleet";
  collapsible?: "hidden" | "dock" | "none";
  side?: "left" | "right";
  closeButton?: boolean;
}

const SidebarMobileSheet = ({
  closeButton = true,
  collapsible = "hidden",
  side = "left",
  intent = "default",
  className,
  ...props
}: SidebarProps) => {
  const { isOpenOnMobile, setIsOpenOnMobile } = useSidebar();

  return (
    <Sheet isOpen={isOpenOnMobile} onOpenChange={setIsOpenOnMobile} {...props}>
      <Sheet.Content
        closeButton={closeButton}
        aria-label="Sidebar"
        data-sidebar-intent="default"
        className="w-(--sidebar-width-mobile) [&>button]:hidden"
        isFloat={intent === "float"}
        side={side}
      >
        <Sheet.Body className="px-0 sm:px-0">{props.children}</Sheet.Body>
      </Sheet.Content>
    </Sheet>
  );
};

export default SidebarMobileSheet;
