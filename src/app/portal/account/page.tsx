import { AccountSetting02Icon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

import { Account } from "@/features/account/components";

export default async function AccountPage() {
  return (
    <>
      <PageHeader
        title="Account"
        subTitle="Manage your account"
        icon={AccountSetting02Icon}
        className={{
          container: "bg-bg",
        }}
      />
      <div className="min-h-0 overflow-y-auto">
        <Account />
      </div>
    </>
  );
}
