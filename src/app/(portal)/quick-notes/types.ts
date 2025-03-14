import type { Hub, QuickNote } from "@/db/schema";

export type HubSummary = Pick<Hub, "id" | "name">;
export type NoteSummary = Pick<
  QuickNote,
  "id" | "content" | "updatedAt" | "hubId"
> & {
  clientId?: string; // Optional client-side ID for stable animations
};

export type HubWithNotes = {
  hub: HubSummary;
  notes: NoteSummary[];
};
