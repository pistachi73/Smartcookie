import { CreateHubMultistepForm } from "@/features/hub/components/create-hub-multistep-form";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

const NewHubPage = () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Hubs", href: "/portal/hubs" },
          { label: "New", href: "/portal/hubs/new" },
        ]}
      />
      <CreateHubMultistepForm />
    </>
  );
};

export default NewHubPage;
