export type AccountTab = "settings" | "subscription";

export const ACCOUNT_TABS: {
  id: AccountTab;
  label: string;
}[] = [
  {
    id: "settings",
    label: "Account Settings",
  },
  {
    id: "subscription",
    label: "Subscription",
  },
];
