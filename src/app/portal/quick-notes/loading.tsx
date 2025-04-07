import { QuickNotesLoading } from "@/features/notes/components/loading";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { NoteIcon } from "@hugeicons-pro/core-solid-rounded";

export default function QuickNotesLoadingg() {
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
}
