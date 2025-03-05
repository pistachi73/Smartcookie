import type { Hub, QuickNote } from "@/db/schema";

export type HubSummary = Pick<Hub, "id" | "name">;
export type NoteSummary = Pick<
  QuickNote,
  "id" | "content" | "updatedAt" | "hubId"
>;

export type HubWithNotes = {
  hub: HubSummary;
  notes: NoteSummary[];
};
