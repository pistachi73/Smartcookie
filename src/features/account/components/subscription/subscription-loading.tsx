import { LoadingTabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/classes";

import { ACCOUNT_TABS } from "../../lib/constants";
import { SubscriptionCardSkeleton } from "./subscription-cards/subscription-card-skeleton";
import { SubscriptionLayout } from "./subscription-layout";

export const SubscriptionLoading = () => {
  return (
    <SubscriptionLayout>
      <LoadingTabs
        aria-label="Hub Dashboard"
        className="flex-1 gap-4 sm:gap-6 h-full"
      >
        <LoadingTabs.List
          className={cn("w-full sticky top-0 px-5 h-12 pt-3 bg-white")}
        >
          {ACCOUNT_TABS.map((tab) => {
            return (
              <LoadingTabs.Tab
                isSelected={tab.id === "subscription"}
                key={tab.id}
                id={tab.id}
                className="px-2"
              >
                <p
                  className={cn(
                    "flex items-center gap-2",
                    tab.id === "subscription" && "text-primary",
                  )}
                >
                  {tab.label}
                </p>
              </LoadingTabs.Tab>
            );
          })}
        </LoadingTabs.List>

        <LoadingTabs.Panel
          id="subscription"
          className="max-w-[840px] mx-auto w-full p-4 sm:p-5 space-y-4 bg-bg"
        >
          <SubscriptionCardSkeleton />
        </LoadingTabs.Panel>
      </LoadingTabs>
    </SubscriptionLayout>
  );
};
