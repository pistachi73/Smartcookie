import { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";

import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";

import { Students } from "@/features/students/components";

const StudentsPage = () => {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          { label: "Students", href: "/portal/students", icon: UserGroupIcon },
        ]}
      />
      <Students />
    </>
  );
};

export default StudentsPage;
