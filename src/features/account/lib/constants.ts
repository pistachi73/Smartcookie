export type AccountTab = "account-settings" | "subscription";

export const getValidTab = (tab: string | null): AccountTab => {
  if (!tab) return "account-settings";
  return tab === "account-settings" || tab === "subscription"
    ? tab
    : "account-settings";
};

export const ACCOUNT_TABS: {
  id: AccountTab;
  label: string;
}[] = [
  {
    id: "account-settings",
    label: "Account Settings",
  },
  {
    id: "subscription",
    label: "Subscription",
  },
];
