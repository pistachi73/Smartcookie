import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { QuickNotesLoading } from "@/features/quick-notes/components/loading";

const LoadingQuickNotesPage = async () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          {
            label: "Quick Notes",
            href: "/portal/quick-notes",
            icon: NoteIcon,
          },
        ]}
      />
      <QuickNotesLoading />
    </>
  );
};

export default LoadingQuickNotesPage;
