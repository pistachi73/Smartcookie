"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Heading } from "@/shared/components/ui/heading";
import { Tabs } from "@/shared/components/ui/tabs";
import useNavigateWithParams from "@/shared/hooks/use-navigate-with-params";
import { cn } from "@/shared/lib/utils";

import { ACCOUNT_TABS, getValidTab } from "../lib/constants";
import { AccountLayout } from "./account-layout";
import { DangerZone } from "./account-settings/danger-zone";
import { UpdateEmail } from "./account-settings/update-email";
import { UpdateNameAvatar } from "./account-settings/update-name-avatar";
import { UpdatePassword } from "./account-settings/update-password";
import { UpdateTFA } from "./account-settings/update-tfa";
import { Subscription } from "./subscription";

export const Account = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("t");
  const validTab = getValidTab(tab);
  const { createHrefWithParams } = useNavigateWithParams();
  const router = useRouter();

  return (
    <AccountLayout>
      <Tabs
        className={"relative h-full overflow-hidden "}
        selectedKey={validTab}
        onSelectionChange={(key) => {
          router.push(
            createHrefWithParams("/portal/account", {
              t: key as string,
            }),
          );
        }}
      >
        <Tabs.List
          className={cn("w-full sticky top-0 px-5 h-12 pt-3 bg-white")}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id} className="px-2">
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
        <Tabs.Panel
          id="account-settings"
          className="max-w-[840px] mx-auto w-full p-4 sm:p-5 space-y-4 bg-bg"
        >
          <div className="space-y-1.5 pb-4">
            <Heading
              level={2}
              className="sm:text-2xl text-xl font-bold"
              tracking="tight"
            >
              Account Settings
            </Heading>
            <p className="text-muted-fg text-base">
              Manage your account preferences and security settings
            </p>
          </div>
          <UpdateNameAvatar />
          <UpdateEmail />
          <UpdatePassword />
          <UpdateTFA />
          <DangerZone />
        </Tabs.Panel>

        <Tabs.Panel
          id="subscription"
          className="max-w-[840px] mx-auto w-full p-4 sm:p-5 space-y-4"
        >
          <div className="space-y-1.5 pb-4">
            <Heading
              level={2}
              className="sm:text-2xl text-xl font-bold"
              tracking="tight"
            >
              Subscription
            </Heading>
            <p className="text-muted-fg text-base">
              Manage your billing and subscription preferences
            </p>
          </div>
          <Subscription />
        </Tabs.Panel>
      </Tabs>
    </AccountLayout>
  );
};
