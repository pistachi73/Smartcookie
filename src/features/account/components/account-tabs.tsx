import { Tabs } from "@/shared/components/ui/tabs";
import { cn } from "@/shared/lib/utils";

import { useRouter } from "@/i18n/navigation";
import { ACCOUNT_TABS, type AccountTab } from "../lib/constants";

export const AccountTabs = ({
  selectedTab,
  children,
}: {
  selectedTab: AccountTab;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <Tabs
      className={"relative h-full"}
      selectedKey={selectedTab}
      onSelectionChange={(key) => {
        router.push(`/portal/account/${key}`);
      }}
    >
      <Tabs.List className="w-full px-5 h-12 pt-3 bg-white">
        {ACCOUNT_TABS.map((tab) => (
          <Tabs.Tab
            key={tab.id}
            id={tab.id}
            className="px-2"
            aria-label={tab.label}
          >
            {({ isSelected }) => {
              return (
                <p
                  className={cn(
                    "flex items-center gap-2",
                    isSelected && "text-primary",
                  )}
                >
                  {tab.label}
                </p>
              );
            }}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {children}
    </Tabs>
  );
};
