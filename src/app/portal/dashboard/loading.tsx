import { SkeletonDashboard } from "@/features/dashboard/components/skeleton-dashboard";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";

const LoadingDashboardPage = () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          {
            label: "Dashboard",
            href: "/portal/dashboard",
            icon: DashboardSquare01Icon,
          },
        ]}
      />
      <SkeletonDashboard />
    </>
  );
};

export default LoadingDashboardPage;
