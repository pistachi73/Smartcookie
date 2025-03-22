import { HubList } from "@/features/hub/components/hub-list";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

const HubsPage = () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs" },
        ]}
      />
      <HubList />
    </>
  );
};

export default HubsPage;
