import type { Metadata } from "next";

import { generatePortalMetadata } from "@/shared/lib/generate-metadata";

import { AccountSettings } from "@/features/account/components/account-settings";

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePortalMetadata({ namespace: "Metadata.Account" });
};

export default function AccountSettingsPage() {
  return <AccountSettings />;
}
