import { AccountSetting02Icon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

export const AccountSettingsLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <PageHeader
        title="Account Settings"
        subTitle="Manage your account preferences and security settings"
        icon={AccountSetting02Icon}
        className={{
          container: "bg-bg ",
        }}
      />
      <div className="min-h-0 overflow-y-auto">{children}</div>
    </>
  );
};
