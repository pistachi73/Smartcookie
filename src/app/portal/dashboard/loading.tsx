import { DashboardSquare01Icon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { SkeletonDashboard } from "@/features/dashboard/components/skeleton-dashboard";

const LoadingDashboardPage = async () => {
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
