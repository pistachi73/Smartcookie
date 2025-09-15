import { Invoice02Icon } from "@hugeicons-pro/core-solid-rounded";

import { PageHeader } from "@/shared/components/layout/page-header";

export const SubscriptionLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <PageHeader
        title="Subscription"
        subTitle="Manage your billing and subscription preferences"
        icon={Invoice02Icon}
        className={{
          container: "bg-bg ",
        }}
      />
      <div className="min-h-0 overflow-y-auto">{children}</div>
    </>
  );
};
