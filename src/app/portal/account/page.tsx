import { Account } from "@/features/account/components";
import { PageHeader } from "@/shared/components/layout/page-header";
import { PortalNav } from "@/shared/components/layout/portal-nav/portal-nav";
import { AccountSetting02Icon } from "@hugeicons-pro/core-solid-rounded";

export default async function AccountPage() {
  return (
    <>
      <PortalNav
        breadcrumbs={[
          { label: "Portal", href: "/portal" },
          {
            label: "Account",
            href: "/portal/account",
            icon: AccountSetting02Icon,
          },
        ]}
      />
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
