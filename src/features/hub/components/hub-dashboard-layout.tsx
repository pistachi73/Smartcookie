import { HubHeader } from "./hub-header";

export type HubDashboardLayoutProps = {
  hubName?: string;
  children?: React.ReactNode;
};

export const HubDashboardLayout = ({
  children,
  hubName,
}: HubDashboardLayoutProps) => (
  <div className="h-full overflow-auto flex flex-col bg-bg">
    <HubHeader hubName={hubName} />
    {children}
  </div>
);
