"use client";

import { Heading } from "@/shared/components/ui/heading";
import { Tabs } from "@/shared/components/ui/tabs";

import { AccountTabs } from "../account-tabs";
import { AccountSettingsLayout } from "./account-settings-layout";
import { DangerZone } from "./danger-zone";
import { UpdateEmail } from "./update-email";
import { UpdateNameAvatar } from "./update-name-avatar";
import { UpdatePassword } from "./update-password";
import { UpdateTFA } from "./update-tfa";

export const AccountSettings = () => {
  return (
    <AccountSettingsLayout>
      <AccountTabs selectedTab="settings">
        <Tabs.Panel
          id="settings"
          className="max-w-[840px] mx-auto w-full p-4 sm:p-5 space-y-4"
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
      </AccountTabs>
    </AccountSettingsLayout>
  );
};
